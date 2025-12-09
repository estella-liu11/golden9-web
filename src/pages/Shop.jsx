import { useState } from 'react';

export default function Shop() {
    // Mock data - will be replaced with API calls
    const [products] = useState([
        {
            id: 1,
            name: 'Professional Pool Cue',
            price: 299.99,
            points: 2000,
            description: 'High-quality professional pool cue with premium materials.',
            image: 'https://via.placeholder.com/300x300?text=Pool+Cue',
        },
        {
            id: 2,
            name: 'Billiard Chalk Set',
            price: 15.99,
            points: 100,
            description: 'Premium billiard chalk set for better grip and control.',
            image: 'https://via.placeholder.com/300x300?text=Chalk+Set',
        },
        {
            id: 3,
            name: 'Pool Table Brush',
            price: 25.99,
            points: 150,
            description: 'Professional pool table brush for maintaining your table.',
            image: 'https://via.placeholder.com/300x300?text=Table+Brush',
        },
        {
            id: 4,
            name: 'Golden9 T-Shirt',
            price: 29.99,
            points: 200,
            description: 'Official Golden9 club t-shirt. Show your support!',
            image: 'https://via.placeholder.com/300x300?text=T-Shirt',
        },
    ]);

    const handlePurchase = (productId, usePoints = false) => {
        // TODO: Implement purchase logic with API call
        alert(`Purchase for product ${productId} ${usePoints ? 'with points' : 'with cash'} will be implemented with API integration`);
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop</h1>
                    <p className="text-xl text-gray-600">
                        Browse our selection of premium billiards equipment and merchandise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-gray-900 mb-1">${product.price}</p>
                                    <p className="text-sm text-primary">or {product.points} points</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePurchase(product.id, false)}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={() => handlePurchase(product.id, true)}
                                        className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm"
                                    >
                                        Use Points
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No products available at the moment.</p>
                        <p className="text-gray-500 mt-2">Check back soon for new items!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

