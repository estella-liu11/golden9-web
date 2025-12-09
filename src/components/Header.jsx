import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userInitial, setUserInitial] = useState('');

    const resolveInitial = (name = '', email = '') => {
        if (name) {
            return name.trim().charAt(0).toUpperCase();
        }
        if (email) {
            return email.trim().charAt(0).toUpperCase();
        }
        return '';
    };

    useEffect(() => {
        const readProfile = () => {
            try {
                const profile = JSON.parse(localStorage.getItem('userProfile'));
                if (profile && (profile.username || profile.full_name || profile.email)) {
                    setUserInitial(
                        resolveInitial(profile.username || profile.full_name, profile.email)
                    );
                    return;
                }
            } catch (err) {
                console.error('Failed to parse userProfile', err);
            }
            setUserInitial('');
        };

        readProfile();
        const handleProfileUpdate = () => readProfile();

        window.addEventListener('storage', handleProfileUpdate);
        window.addEventListener('user-profile-updated', handleProfileUpdate);

        return () => {
            window.removeEventListener('storage', handleProfileUpdate);
            window.removeEventListener('user-profile-updated', handleProfileUpdate);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/events', label: 'Events' },
        { path: '/shop', label: 'Shop' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/membership', label: 'Membership' },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-primary">Golden9</div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(link.path)
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {userInitial ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-semibold text-base uppercase"
                                aria-label="Go to dashboard"
                            >
                                {userInitial}
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 text-base font-medium rounded-md ${isActive(link.path)
                                    ? 'text-primary bg-purple-50'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {userInitial ? (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate('/dashboard');
                                }}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-semibold uppercase"
                                aria-label="Go to dashboard"
                            >
                                {userInitial}
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-white bg-primary rounded-md hover:bg-purple-700"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}

