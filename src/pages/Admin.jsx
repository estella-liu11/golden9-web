import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, eventAPI, productAPI } from '../services/api';

export default function Admin() {
    const [activeView, setActiveView] = useState('dashboard');
    const navigate = useNavigate();

    // Data states
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, activeEvents: 0, totalProducts: 0 });

    // Modal states
    const [showUserModal, setShowUserModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Form states
    const [userForm, setUserForm] = useState({
        email: '',
        username: '',
        password: '',
        role: 'standard',
        member_level: null,
        points: 0,
        is_active: true,
    });
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        location: '',
        start_time: '',
        registration_deadline: '',
        status: 'scheduled',
        fee: 0,
        max_participants: null,
    });
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        is_available: true,
        image_url: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Local fallback storage helpers (used when API is unreachable)
    const STORAGE_KEYS = {
        users: 'admin_users_cache',
        events: 'admin_events_cache',
        products: 'admin_products_cache',
    };

    const getLocalData = (key) => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error('Failed to parse local data', err);
            return [];
        }
    };

    const setLocalData = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (err) {
            console.error('Failed to write local data', err);
        }
    };

    const generateUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
    };

    const makeId = (prefix) => {
        const uuid = generateUuid();
        return prefix ? `${prefix}_${uuid}` : uuid;
    };

    // Redirect non-admin users away from admin panel
    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role !== 'admin') {
            navigate('/login?role=admin');
        }
    }, [navigate]);

    // Fetch data functions
    const fetchUsers = async () => {
        try {
            const data = await userAPI.getAll();
            setUsers(data);
            setStats(prev => ({ ...prev, totalUsers: data.length }));
            setLocalData(STORAGE_KEYS.users, data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            const local = getLocalData(STORAGE_KEYS.users);
            setUsers(local);
            setStats(prev => ({ ...prev, totalUsers: local.length }));
            setError('无法连接服务器，正在显示本地数据 (Users)');
        }
    };

    const fetchEvents = async () => {
        try {
            const data = await eventAPI.getAll();
            setEvents(data);
            const activeCount = data.filter(e => e.status === 'scheduled' || e.status === 'ongoing').length;
            setStats(prev => ({ ...prev, activeEvents: activeCount }));
            setLocalData(STORAGE_KEYS.events, data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            const local = getLocalData(STORAGE_KEYS.events);
            setEvents(local);
            const activeCount = local.filter(e => e.status === 'scheduled' || e.status === 'ongoing').length;
            setStats(prev => ({ ...prev, activeEvents: activeCount }));
            setError('无法连接服务器，正在显示本地数据 (Events)');
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await productAPI.getAll();
            setProducts(data);
            setStats(prev => ({ ...prev, totalProducts: data.length }));
            setLocalData(STORAGE_KEYS.products, data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            const local = getLocalData(STORAGE_KEYS.products);
            setProducts(local);
            setStats(prev => ({ ...prev, totalProducts: local.length }));
            setError('无法连接服务器，正在显示本地数据 (Products)');
        }
    };

    // Load data when view changes
    useEffect(() => {
        if (activeView === 'users') {
            fetchUsers();
        } else if (activeView === 'events') {
            fetchEvents();
        } else if (activeView === 'products') {
            fetchProducts();
        } else if (activeView === 'dashboard' || activeView === 'leaderboard') {
            fetchUsers();
            fetchEvents();
            fetchProducts();
        }
    }, [activeView]);

    // Auto-refresh data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeView === 'users') {
                fetchUsers();
            } else if (activeView === 'events') {
                fetchEvents();
            } else if (activeView === 'products') {
                fetchProducts();
            } else if (activeView === 'dashboard' || activeView === 'leaderboard') {
                fetchUsers();
                fetchEvents();
                fetchProducts();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [activeView]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    // User Management Handlers
    const handleAddUser = () => {
        setEditingItem(null);
        setUserForm({
            email: '',
            username: '',
            password: '',
            role: 'standard',
            member_level: null,
            points: 0,
            is_active: true,
        });
        setShowPasswordChange(false);
        setShowPasswordConfirm(false);
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setEditingItem(user);
        setUserForm({
            email: user.email || '',
            username: user.username || '',
            password: '',
            role: user.role || 'standard',
            member_level: user.member_level || null,
            points: user.points || 0,
            is_active: user.is_active !== undefined ? user.is_active : true,
        });
        setShowPasswordChange(false);
        setShowPasswordConfirm(false);
        setShowUserModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userData = {
                email: userForm.email,
                username: userForm.username,
                role: userForm.role,
                points: parseInt(userForm.points) || 0,
                is_active: userForm.is_active,
            };

            // Add member_level if role is member
            if (userForm.role === 'member') {
                userData.member_level = userForm.member_level || null;
            } else {
                userData.member_level = null;
            }

            if (userForm.password && (showPasswordChange || !editingItem)) {
                userData.password = userForm.password;
            }

            if (editingItem) {
                await userAPI.update(editingItem.user_id, userData);
            } else {
                if (!userForm.password) {
                    setError('Password is required for new users');
                    setLoading(false);
                    return;
                }
                await userAPI.create(userData);
            }

            setShowUserModal(false);
            setShowPasswordChange(false);
            setShowPasswordConfirm(false);
            fetchUsers();
        } catch (err) {
            // Fallback to local persistence when API fails
            console.error('Saving user via API failed, using local store:', err);
            const local = getLocalData(STORAGE_KEYS.users);
            let nextUsers;

            if (editingItem) {
                nextUsers = local.map(u => u.user_id === editingItem.user_id ? { ...u, ...userData } : u);
            } else {
                nextUsers = [...local, { ...userData, user_id: makeId('user') }];
            }

            setLocalData(STORAGE_KEYS.users, nextUsers);
            setUsers(nextUsers);
            setStats(prev => ({ ...prev, totalUsers: nextUsers.length }));
            setShowUserModal(false);
            setShowPasswordChange(false);
            setShowPasswordConfirm(false);
            setError('API 不可用，数据已保存在本地 (User)');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        setLoading(true);
        try {
            await userAPI.delete(userId);
            setDeleteConfirm(null);
            fetchUsers();
        } catch (err) {
            console.error('Delete user via API failed, using local store:', err);
            const local = getLocalData(STORAGE_KEYS.users).filter(u => u.user_id !== userId);
            setLocalData(STORAGE_KEYS.users, local);
            setUsers(local);
            setStats(prev => ({ ...prev, totalUsers: local.length }));
            setDeleteConfirm(null);
            setError('API 不可用，已从本地删除 (User)');
        } finally {
            setLoading(false);
        }
    };

    // Event Management Handlers
    const handleAddEvent = () => {
        setEditingItem(null);
        setEventForm({
            title: '',
            description: '',
            location: '',
            start_time: '',
            registration_deadline: '',
            status: 'scheduled',
            fee: 0,
            max_participants: null,
        });
        setShowEventModal(true);
    };

    const handleEditEvent = (event) => {
        setEditingItem(event);
        setEventForm({
            title: event.title || '',
            description: event.description || '',
            location: event.location || '',
            start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
            registration_deadline: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
            status: event.status || 'scheduled',
            fee: event.fee || 0,
            max_participants: event.max_participants || null,
        });
        setShowEventModal(true);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const isEditing = Boolean(editingItem);
        const eventId = isEditing ? editingItem.event_id : generateUuid();

        try {
            const eventData = {
                event_id: eventId,
                title: eventForm.title,
                description: eventForm.description,
                location: eventForm.location,
                start_time: eventForm.start_time,
                end_time: eventForm.registration_deadline || null,
                status: eventForm.status,
                fee: parseFloat(eventForm.fee) || 0,
                max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null,
            };

            if (isEditing) {
                await eventAPI.update(editingItem.event_id, eventData);
            } else {
                await eventAPI.create(eventData);
            }

            setShowEventModal(false);
            fetchEvents();
        } catch (err) {
            console.error('Saving event via API failed, using local store:', err);
            const local = getLocalData(STORAGE_KEYS.events);
            let nextEvents;

            if (isEditing) {
                nextEvents = local.map(e => e.event_id === editingItem.event_id ? { ...e, ...eventData } : e);
            } else {
                nextEvents = [...local, { ...eventData }];
            }

            setLocalData(STORAGE_KEYS.events, nextEvents);
            setEvents(nextEvents);
            const activeCount = nextEvents.filter(e => e.status === 'scheduled' || e.status === 'ongoing').length;
            setStats(prev => ({ ...prev, activeEvents: activeCount }));
            setShowEventModal(false);
            setError('API 不可用，数据已保存在本地 (Event)');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        setLoading(true);
        try {
            await eventAPI.delete(eventId);
            setDeleteConfirm(null);
            fetchEvents();
        } catch (err) {
            console.error('Delete event via API failed, using local store:', err);
            const local = getLocalData(STORAGE_KEYS.events).filter(e => e.event_id !== eventId);
            setLocalData(STORAGE_KEYS.events, local);
            setEvents(local);
            const activeCount = local.filter(e => e.status === 'scheduled' || e.status === 'ongoing').length;
            setStats(prev => ({ ...prev, activeEvents: activeCount }));
            setDeleteConfirm(null);
            setError('API 不可用，已从本地删除 (Event)');
        } finally {
            setLoading(false);
        }
    };

    // Product Management Handlers
    const handleAddProduct = () => {
        setEditingItem(null);
        setProductForm({
            name: '',
            description: '',
            price: 0,
            category: '',
            is_available: true,
            image_url: '',
        });
        setShowProductModal(true);
    };

    const handleEditProduct = (product) => {
        setEditingItem(product);
        setProductForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            category: product.category || '',
            is_available: product.is_available !== undefined ? product.is_available : true,
            image_url: product.image_url || '',
        });
        setShowProductModal(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const isEditing = Boolean(editingItem);
        const productId = isEditing ? editingItem.product_id : generateUuid();

        try {
            const productData = {
                product_id: productId,
                name: productForm.name,
                description: productForm.description,
                price: parseFloat(productForm.price) || 0,
                category: productForm.category || null,
                is_available: productForm.is_available,
                image_url: productForm.image_url || null,
            };

            if (isEditing) {
                await productAPI.update(editingItem.product_id, productData);
            } else {
                await productAPI.create(productData);
            }

            setShowProductModal(false);
            fetchProducts();
        } catch (err) {
            console.error('Saving product via API failed, using local store:', err);
            const local = getLocalData(STORAGE_KEYS.products);
            let nextProducts;

            if (isEditing) {
                nextProducts = local.map(p => p.product_id === editingItem.product_id ? { ...p, ...productData } : p);
            } else {
                nextProducts = [...local, { ...productData }];
            }

            setLocalData(STORAGE_KEYS.products, nextProducts);
            setProducts(nextProducts);
            setStats(prev => ({ ...prev, totalProducts: nextProducts.length }));
            setShowProductModal(false);
            setError('API 不可用，数据已保存在本地 (Product)');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        setLoading(true);
        try {
            await productAPI.delete(productId);
            setDeleteConfirm(null);
            fetchProducts();
        } catch (err) {
            console.error('Delete product via API failed, using local store:', err);
            const local = getLocalData(STORAGE_KEYS.products).filter(p => p.product_id !== productId);
            setLocalData(STORAGE_KEYS.products, local);
            setProducts(local);
            setStats(prev => ({ ...prev, totalProducts: local.length }));
            setDeleteConfirm(null);
            setError('API 不可用，已从本地删除 (Product)');
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'users', label: 'User Management', icon: '👥' },
        { id: 'events', label: 'Event Management', icon: '📅' },
        { id: 'products', label: 'Product Management', icon: '🛍️' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                                <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Events</h3>
                                <p className="text-3xl font-bold text-primary">{stats.activeEvents}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Products</h3>
                                <p className="text-3xl font-bold text-primary">{stats.totalProducts}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Add User
                            </button>
                        </div>
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.user_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.role === 'member' ? (user.member_level || '-') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.points || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-primary hover:text-purple-700 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'user', id: user.user_id, name: user.username })}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'events':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                            <button
                                onClick={handleAddEvent}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Create Event
                            </button>
                        </div>
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动开始日期</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名截止日期</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <tr key={event.event_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.start_time ? new Date(event.start_time).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.end_time ? new Date(event.end_time).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${event.fee || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditEvent(event)}
                                                    className="text-primary hover:text-purple-700 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'event', id: event.event_id, name: event.title })}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {events.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No events found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                            <button
                                onClick={handleAddProduct}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Add Product
                            </button>
                        </div>
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.product_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.is_available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="text-primary hover:text-purple-700 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'product', id: product.product_id, name: product.name })}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No products found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'leaderboard':
                const sortedUsers = [...users].sort((a, b) => (b.points || 0) - (a.points || 0));
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
                                <p className="text-sm text-gray-600">排名按用户 points（score）实时更新</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Total Players: {users.length}
                            </div>
                        </div>
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points (Score)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedUsers.map((user, index) => (
                                        <tr key={user.user_id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                #{index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.username || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                                                {user.points || 0}
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No leaderboard data yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white min-h-screen">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-8">Golden9 Admin</h1>
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === item.id
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-white">
                {renderContent()}
            </main>

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {editingItem ? 'Edit User' : 'Add User'}
                        </h3>
                        <form onSubmit={handleSaveUser}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={userForm.username}
                                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => {
                                            const newRole = e.target.value;
                                            setUserForm({
                                                ...userForm,
                                                role: newRole,
                                                member_level: newRole === 'member' ? userForm.member_level : null
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                {userForm.role === 'member' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Level</label>
                                        <select
                                            value={userForm.member_level || ''}
                                            onChange={(e) => setUserForm({ ...userForm, member_level: e.target.value || null })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        >
                                            <option value="">Select Level</option>
                                            <option value="Gold">Gold</option>
                                            <option value="Silver">Silver</option>
                                            <option value="Bronze">Bronze</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    {editingItem ? (
                                        <>
                                            {!showPasswordChange ? (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="password"
                                                            value="••••••••"
                                                            disabled
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswordConfirm(true)}
                                                            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap"
                                                        >
                                                            Change Password
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={userForm.password}
                                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={userForm.password}
                                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                    <input
                                        type="number"
                                        value={userForm.points}
                                        onChange={(e) => setUserForm({ ...userForm, points: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={userForm.is_active}
                                            onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {editingItem ? 'Edit Event' : 'Create Event'}
                        </h3>
                        <form onSubmit={handleSaveEvent}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={eventForm.title}
                                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={eventForm.description}
                                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={eventForm.location}
                                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1"> Event Start Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={eventForm.start_time}
                                            onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                                        <input
                                            type="datetime-local"
                                            value={eventForm.registration_deadline}
                                            onChange={(e) => setEventForm({ ...eventForm, registration_deadline: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={eventForm.status}
                                            onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={eventForm.fee}
                                            onChange={(e) => setEventForm({ ...eventForm, fee: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                                        <input
                                            type="number"
                                            value={eventForm.max_participants || ''}
                                            onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value || null })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEventModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {editingItem ? 'Edit Product' : 'Add Product'}
                        </h3>
                        <form onSubmit={handleSaveProduct}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={productForm.price}
                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={productForm.category}
                                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={productForm.image_url}
                                        onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={productForm.is_available}
                                            onChange={(e) => setProductForm({ ...productForm, is_available: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Available</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowProductModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Change Confirmation Modal */}
            {showPasswordConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Password Change</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure to edit user's password?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowPasswordConfirm(false);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                No
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordConfirm(false);
                                    setShowPasswordChange(true);
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700"
                            >
                                Yes, I am
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete {deleteConfirm.name}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteConfirm.type === 'user') {
                                        handleDeleteUser(deleteConfirm.id);
                                    } else if (deleteConfirm.type === 'event') {
                                        handleDeleteEvent(deleteConfirm.id);
                                    } else if (deleteConfirm.type === 'product') {
                                        handleDeleteProduct(deleteConfirm.id);
                                    }
                                }}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
