import { useState, useEffect } from 'react';

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load leaderboard data
    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await fetch('/leaderboard.json');
            if (!response.ok) {
                throw new Error('Failed to load leaderboard data');
            }
            const data = await response.json();
            setUsers(data);
            setError('');
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
            setError('Unable to load leaderboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        loadLeaderboard();
    }, []);

    const getRankBadgeColor = (rank) => {
        if (rank === 1) return 'bg-yellow-100 text-yellow-800';
        if (rank === 2) return 'bg-gray-100 text-gray-800';
        if (rank === 3) return 'bg-orange-100 text-orange-800';
        return 'bg-gray-50 text-gray-600';
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
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                                            Loading leaderboard...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No leaderboard data available
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.rank || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-sm font-bold rounded-full ${getRankBadgeColor(user.rank)}`}>
                                                    #{user.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {user.points.toLocaleString()}
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
                        Rankings are updated by administrators. Check back later for the latest standings!
                    </p>
                </div>
            </div>
        </div>
    );
}

