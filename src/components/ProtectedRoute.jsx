import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    // TODO: Replace with actual auth check from AuthContext
    // For now, check localStorage for token
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // Should be set during login

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && userRole !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

