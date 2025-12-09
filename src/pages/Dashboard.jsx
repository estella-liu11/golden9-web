import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        phone: '',
        fullName: '',
        memberLevel: 'Standard',
        points: 0,
    });
    const [recentActivities, setRecentActivities] = useState([
        { id: 1, type: 'Event Registration', description: 'Registered for Winter Tournament', date: '2025-01-10', points: '+50' },
        { id: 2, type: 'Purchase', description: 'Bought Pool Cue', date: '2025-01-08', points: '-200' },
        { id: 3, type: 'Event Participation', description: 'Completed Spring League', date: '2025-01-05', points: '+100' },
    ]);
    const [error, setError] = useState('');

    useEffect(() => {
        const hydrateFromLocal = () => {
            try {
                const profile = JSON.parse(localStorage.getItem('userProfile'));
                if (profile) {
                    setUserInfo(prev => ({
                        ...prev,
                        username: profile.username || profile.full_name || '',
                        email: profile.email || '',
                        phone: profile.phone_number || '',
                        fullName: profile.full_name || profile.username || '',
                        memberLevel: profile.memberLevel || profile.role || 'Standard',
                        points: profile.points ?? 0,
                    }));
                    return profile.user_id;
                }
            } catch (err) {
                console.error('Failed to parse userProfile', err);
            }
            return null;
        };

        const fetchProfile = async (userId) => {
            if (!userId) return;
            try {
                const data = await userAPI.getById(userId);
                setUserInfo({
                    username: data.username || data.full_name || '',
                    email: data.email || '',
                    phone: data.phone_number || '',
                    fullName: data.full_name || data.username || '',
                    memberLevel: data.role || 'Standard',
                    points: data.points ?? 0,
                });
                localStorage.setItem('userProfile', JSON.stringify({
                    user_id: data.user_id,
                    username: data.username || '',
                    full_name: data.full_name || '',
                    email: data.email || '',
                    phone_number: data.phone_number || '',
                    memberLevel: data.role || 'Standard',
                    points: data.points ?? 0,
                }));
                window.dispatchEvent(new Event('user-profile-updated'));
            } catch (err) {
                setError('无法加载用户信息，请稍后再试');
            }
        };

        const userId = hydrateFromLocal();
        fetchProfile(userId);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userProfile');
        window.dispatchEvent(new Event('user-profile-updated'));
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Log out
                    </button>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Member Level</h3>
                        <p className="text-2xl font-bold text-primary">{userInfo.memberLevel}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Points Balance</h3>
                        <p className="text-2xl font-bold text-gray-900">{userInfo.points.toLocaleString()}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                        <p className="text-lg font-semibold text-gray-900">{userInfo.email}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                        <p className="text-lg font-semibold text-gray-900">{userInfo.phone}</p>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <p className="text-gray-900">{userInfo.fullName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <p className="text-gray-900">{userInfo.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <p className="text-gray-900">{userInfo.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <p className="text-gray-900">{userInfo.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Activity History */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">{activity.type}</h3>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                                </div>
                                <div className={`text-lg font-bold ${activity.points.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {activity.points}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

