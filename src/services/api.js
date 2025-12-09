const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

// User Management APIs
export const userAPI = {
    getAll: () => apiCall('/users'),
    getById: (id) => apiCall(`/users/${id}`),
    create: (userData) => apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    update: (id, userData) => apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    delete: (id) => apiCall(`/users/${id}`, {
        method: 'DELETE',
    }),
};

// Event Management APIs
export const eventAPI = {
    getAll: () => apiCall('/events'),
    getById: (id) => apiCall(`/events/${id}`),
    create: (eventData) => apiCall('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
    }),
    update: (id, eventData) => apiCall(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
    }),
    delete: (id) => apiCall(`/events/${id}`, {
        method: 'DELETE',
    }),
};

// Product Management APIs
export const productAPI = {
    getAll: () => apiCall('/products'),
    getById: (id) => apiCall(`/products/${id}`),
    create: (productData) => apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    }),
    update: (id, productData) => apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    }),
    delete: (id) => apiCall(`/products/${id}`, {
        method: 'DELETE',
    }),
};

// Dashboard stats API
export const dashboardAPI = {
    getStats: () => apiCall('/dashboard/stats'),
};

// Auth APIs
export const authAPI = {
    login: (credentials) => apiCall('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (payload) => apiCall('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    }),
};


