import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getAll();
            // Filter out admin users, only show user, member, and standard roles
            const filteredUsers = data.filter(user => {
                const role = (user.role || '').toLowerCase();
                return role === 'user' || role === 'member' || role === 'standard';
            });
            // Sort by points descending, same as Admin leaderboard
            const sortedUsers = [...filteredUsers].sort((a, b) => (b.points || 0) - (a.points || 0));
            setUsers(sortedUsers);
            setError('');
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('无法加载排行榜数据，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Auto-refresh data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUsers();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getRankBadgeColor = (rank) => {
        if (rank === 1) return 'bg-yellow-100 text-yellow-800';
        if (rank === 2) return 'bg-gray-100 text-gray-800';
        if (rank === 3) return 'bg-orange-100 text-orange-800';
        return 'bg-gray-50 text-gray-600';
    };

    const getLevelColor = (level) => {
        if (level === 'Gold') return 'text-yellow-600';
        if (level === 'Silver') return 'text-gray-600';
        return 'text-orange-600';
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
                    <p className="text-xl text-gray-600">
                        See where you rank among our top players. Compete and climb the leaderboard!
                    </p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                                            加载中...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                                            暂无排行榜数据
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.user_id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-sm font-bold rounded-full ${getRankBadgeColor(index + 1)}`}>
                                                    #{index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{user.username || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-semibold ${getLevelColor(user.member_level || 'Bronze')}`}>
                                                    {user.member_level || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {(user.points || 0).toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Rankings are updated in real-time. Keep playing to improve your position!
                    </p>
                </div>
            </div>
        </div>
    );
}

