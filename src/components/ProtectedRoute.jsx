import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const location = useLocation();
    const [authState, setAuthState] = useState({ loading: true, user: null });

    useEffect(() => {
        let isActive = true;
        authAPI.me()
            .then((data) => {
                if (!isActive) return;
                setAuthState({ loading: false, user: data.user || null });
            })
            .catch(() => {
                if (!isActive) return;
                setAuthState({ loading: false, user: null });
            });

        return () => {
            isActive = false;
        };
    }, []);

    if (authState.loading) {
        return null;
    }

    if (!authState.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && authState.user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
