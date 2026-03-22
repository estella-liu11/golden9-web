import { useState } from 'react';
import cue1 from '../assets/cue1.jpg';
import cue12 from '../assets/cue1-2.jpg';
import cue2 from '../assets/cue2.jpg';
import cue22 from '../assets/cue2-2.jpg';
import cue3 from '../assets/cue3.jpg';
import cue32 from '../assets/cue3-2.jpg';
import tip1 from '../assets/tip1.jpg';
import tip12 from '../assets/tip1-2.jpg';

const defaultProducts = [
    {
        id: 1,
        name: 'Professional Cue Stick - AM-14',
        description: 'High-quality cue stick for professional play',
        price: 7000,
        images: [cue1, cue12]
    },
    {
        id: 2,
        name: 'Tournament Cue Stick - Black blade',
        description: 'Premium cue stick designed for tournaments',
        price: 3500,
        images: [cue2, cue22]
    },
    {
        id: 3,
        name: 'Standard Cue Stick - AS-2',
        description: 'Reliable cue stick for regular players',
        price: 800,
        images: [cue3, cue32]
    },
    {
        id: 4,
        name: 'Leather Cue Tip',
        description: 'Replacement leather tip for cue sticks',
        price: 50,
        images: [tip1, tip12]
    }
];

export default function Shop({ products = defaultProducts }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="mb-6 p-4 rounded-md bg-yellow-50 border-l-4 border-yellow-400">
                <strong className="block text-sm text-yellow-800">Notice</strong>
                <p className="mt-1 text-sm text-yellow-700">
                    Shop is display-only — purchases and payments have been disabled. Contact us to book or buy offline.
                </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex space-x-2 mb-4">
                            <img src={product.images[0]} alt={product.name} className="w-1/2 h-60 object-cover rounded" />
                            <img src={product.images[1]} alt={`${product.name} - view 2`} className="w-1/2 h-60 object-cover rounded" />
                        </div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-xl font-bold">${product.price}</div>
                            {/* change purchase action to view-only */}
                            <button
                                onClick={() => setSelectedProduct(product)}
                                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:opacity-95"
                            >
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {selectedProduct.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${selectedProduct.name} - view ${index + 1}`}
                                        className="w-full h-48 object-cover rounded"
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                            <div className="text-2xl font-bold text-primary">${selectedProduct.price}</div>
                            <div className="mt-4 p-4 bg-yellow-50 rounded">
                                <p className="text-sm text-yellow-800">
                                    This is a display-only item. Contact us offline to purchase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

