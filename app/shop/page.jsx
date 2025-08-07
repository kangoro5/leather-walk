'use client'; // Keep this at the top if it's a client component

import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaDollarSign,
    FaShoePrints,
    FaPalette,
    FaTimes,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaCheckCircle,
    FaSpinner // Import spinner for loading state
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

export default function ShopPage() {
    const router = useRouter();
    // Destructure user from useAuth. 'user' will now be the full user object from AuthContext.
    const { isLoggedIn, user } = useAuth(); 

    // State for fetched products and loading/error status
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Initialize loading to true
    const [error, setError] = useState(null);

    // Filter states
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShoe, setSelectedShoe] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false); // New state for add to cart loading
    const [addToCartError, setAddToCartError] = useState(null); // New state for add to cart error

    // New state for image modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    // --- useEffect to fetch products from API ---
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Start loading
            setError(null);   // Clear any previous errors
            try {
                const res = await fetch('http://localhost:8000/api/products'); 

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to fetch products. Status: ${res.status}`);
                }

                const data = await res.json();
                setProducts(data); // Set the fetched products
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || 'Failed to load products. Please try again later.'); // Set the error message
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means this runs once on component mount

    // Derive unique sizes and colors from fetched products
    const uniqueSizes = [...new Set(products.map(p => p.size))].filter(Boolean).sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);

        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }
        if (isNaN(numA) && isNaN(numB)) {
            return String(a).localeCompare(String(b));
        }
        return isNaN(numA) ? 1 : -1;
    });

    const uniqueColors = [...new Set(products.map(p => p.color))].filter(Boolean).sort();


    const filteredProducts = products.filter(product => {
        return (
            (name === '' || product.name.toLowerCase().includes(name.toLowerCase())) &&
            (price === '' || product.price <= Number(price)) &&
            (size === '' || String(product.size) === String(size)) &&
            (color === '' || product.color === color)
        );
    });

    const handleAddToCartClick = (shoe) => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setSelectedShoe(shoe);
        setQuantity(1);
        setAddToCartError(null); // Clear previous errors
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedShoe(null);
        setAddToCartError(null); // Clear errors on close
    };

    // --- UPDATED handleAddToCartConfirm FUNCTION ---
    const handleAddToCartConfirm = async () => {
        if (!selectedShoe || !user || !user._id) { 
            setAddToCartError('Authentication error: User not identified. Please log in again.');
            return;
        }

        if (quantity <= 0 || quantity > selectedShoe.quantity) {
            setAddToCartError(`Please select a quantity between 1 and ${selectedShoe.quantity}.`);
            return;
        }

        setAddToCartLoading(true);
        setAddToCartError(null);

        try {
            const payload = {
                productId: selectedShoe._id,
                quantity: quantity
            };

            // Use the new POST /api/carts/:userId/add route
            const res = await fetch(`http://localhost:8000/api/carts/${user._id}/add`, {
                method: 'POST', // Always POST for adding a single item
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user.token}` // Uncomment if you have authentication tokens
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Backend error response:', errorData); // <-- Add this
                // Backend will return specific error messages, e.g., "Insufficient stock"
                throw new Error(errorData.message || 'Failed to add item to cart.');
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              const text = await res.text();
              throw new Error(`Non-JSON response: ${text.slice(0, 100)}`);
            }
            const cartData = await res.json();
            console.log('Item added to cart successfully:', cartData);

            setModalOpen(false);
            setSuccessModalOpen(true);
        } catch (err) {
            console.error('Error adding to cart:', err);
            setAddToCartError(err.message || 'An unexpected error occurred while adding to cart.');
        } finally {
            setAddToCartLoading(false);
        }
    };
    // --- END UPDATED handleAddToCartConfirm FUNCTION ---

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    // Function to handle image click for large modal
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
        setIsImageModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200">
            {/* Animations for modal */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
                }
                 @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-fast {
                    animation: spin 0.8s linear infinite;
                }
            `}</style>

            {/* Filter Section */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-md py-4 px-2 md:px-4 border-b border-amber-200">
                <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-3 md:gap-4">
                    {/* Search by Name */}
                    <div className="relative flex-1 min-w-[160px] max-w-xs">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 shadow-sm transition-all duration-200"
                        />
                    </div>
                    {/* Max Price */}
                    <div className="relative flex-1 min-w-[120px] max-w-[160px]">
                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input
                            type="number"
                            placeholder="Max price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 shadow-sm transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    {/* Size Filter */}
                    <div className="relative flex-1 min-w-[100px] max-w-[140px]">
                        <FaShoePrints className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <select
                            value={size}
                            onChange={e => setSize(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 shadow-sm bg-white appearance-none transition-all duration-200"
                        >
                            <option value="">All Sizes</option>
                            {uniqueSizes.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    {/* Color Filter */}
                    <div className="relative flex-1 min-w-[100px] max-w-[140px]">
                        <FaPalette className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <select
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 shadow-sm bg-white appearance-none transition-all duration-200"
                        >
                            <option value="">All Colors</option>
                            {uniqueColors.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Display Section */}
            <div className="max-w-6xl mx-auto py-8 px-2 flex flex-wrap gap-6 md:gap-8 justify-center">
                {loading && (
                    <div className="text-center text-amber-700 text-xl mt-20 flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin-fast text-5xl" />
                        Loading products...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 text-xl mt-20 p-4 bg-red-100 border border-red-300 rounded-lg">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="text-amber-900 text-lg font-semibold mt-10 flex items-center gap-2">
                        <FaSearch className="text-amber-500" /> No shoes found matching your criteria.
                    </div>
                )}

                {!loading && !error && filteredProducts.length > 0 && filteredProducts.map(product => (
                    <div
                        key={product._id} 
                        className="bg-white/90 rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center w-full max-w-xs sm:w-72 transform hover:scale-105 transition-transform duration-300"
                    >
                        <img
                            src={product.imageUrl || '/images/placeholder.jpg'} 
                            alt={product.name}
                            className="w-full h-44 object-contain rounded-lg mb-4 bg-white shadow-inner cursor-pointer"
                            onClick={() => handleImageClick(product.imageUrl || '/images/placeholder.jpg')} // Add onClick here
                        />
                        <h3 className="text-lg font-semibold text-amber-900 mb-1">{product.name}</h3>
                        <p className="text-amber-700 font-bold mb-1 flex items-center gap-1">
                            <FaDollarSign className="inline text-amber-500" /> Ksh {product.price.toLocaleString()}
                        </p>
                        <div className="flex gap-3 text-sm text-amber-800 mb-4">
                            <span><FaShoePrints className="inline mr-1" />{product.size || 'N/A'}</span>
                            <span><FaPalette className="inline mr-1" />{product.color || 'N/A'}</span>
                        </div>
                        {/* Only show 'Add to Cart' if there is stock */}
                        {product.quantity > 0 ? (
                            <button
                                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-200 flex items-center gap-2 w-full justify-center"
                                onClick={() => handleAddToCartClick(product)}
                            >
                                <FaShoppingCart />
                                Add to Cart
                            </button>
                        ) : (
                            <button
                                className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-full shadow cursor-not-allowed flex items-center gap-2 w-full justify-center"
                                disabled
                            >
                                Out of Stock
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal Popup (Add to Cart) */}
            {modalOpen && selectedShoe && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn px-2">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-scaleIn transition-all duration-300 ease-out mx-2">
                        <button
                            className="absolute top-4 right-4 text-amber-700 hover:text-red-600 text-2xl transition-colors duration-200"
                            onClick={handleModalClose}
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedShoe.imageUrl || '/images/placeholder.jpg'}
                                alt={selectedShoe.name}
                                className="w-40 h-40 object-contain rounded-lg mb-4 bg-white shadow"
                            />
                            <h2 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                                <FaShoppingCart className="text-amber-700" />
                                {selectedShoe.name}
                            </h2>
                            <p className="text-amber-700 font-semibold mb-1 flex items-center gap-1">
                                <FaDollarSign className="inline text-amber-500" /> Ksh {selectedShoe.price.toLocaleString()}
                            </p>
                            <div className="flex gap-4 text-amber-800 mb-4">
                                <span><FaShoePrints className="inline mr-1" />{selectedShoe.size || 'N/A'}</span>
                                <span><FaPalette className="inline mr-1" />{selectedShoe.color || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col items-center w-full">
                                <label className="mb-2 text-amber-900 font-medium" htmlFor="quantity">Quantity</label>
                                <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden mb-4">
                                    <button
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 transition-colors duration-200"
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        aria-label="Decrease quantity"
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min={1}
                                        max={selectedShoe.quantity}
                                        value={quantity}
                                        onChange={e => setQuantity(Math.max(1, Math.min(selectedShoe.quantity, Number(e.target.value))))}
                                        className="w-16 px-2 py-2 text-amber-900 text-center text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 transition-colors duration-200"
                                        onClick={() => setQuantity(prev => Math.min(selectedShoe.quantity, prev + 1))}
                                        aria-label="Increase quantity"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {addToCartError && (
                                    <p className="text-red-500 text-sm mb-2">{addToCartError}</p>
                                )}
                                {quantity > selectedShoe.quantity && (
                                    <p className="text-red-500 text-sm mt-2">Only {selectedShoe.quantity} available in stock.</p>
                                )}
                                <button
                                    className={`bg-amber-700 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200 w-full flex items-center justify-center gap-2
                                        ${(quantity <= 0 || quantity > selectedShoe.quantity || addToCartLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-800'}`}
                                    onClick={handleAddToCartConfirm}
                                    disabled={quantity <= 0 || quantity > selectedShoe.quantity || addToCartLoading}
                                >
                                    {addToCartLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin-fast" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn px-2">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-scaleIn text-center mx-2">
                        <button
                            className="absolute top-4 right-4 text-amber-700 hover:text-red-600 text-2xl transition-colors duration-200"
                            onClick={handleSuccessClose}
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                        <div className="flex flex-col items-center">
                            <FaCheckCircle className="text-green-500 text-5xl mb-2" />
                            <h2 className="text-2xl font-bold text-amber-900 mb-2">Added to Cart!</h2>
                            <p className="text-amber-700 mb-4">Your item was successfully added to the cart.</p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
                                <a
                                    href="/cart"
                                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-full shadow transition duration-200 flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart />
                                    Go to Cart
                                </a>
                                <button
                                    className="flex-1 bg-white border border-amber-300 hover:bg-amber-100 text-amber-700 font-semibold py-3 rounded-full shadow transition duration-200 flex items-center justify-center gap-2"
                                    onClick={handleSuccessClose}
                                >
                                    <FaSearch />
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn px-2 py-4">
                    <div className="relative bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
                        <button
                            className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-3xl transition-colors duration-200 z-10"
                            onClick={() => setIsImageModalOpen(false)}
                            aria-label="Close image modal"
                        >
                            <FaTimes />
                        </button>
                        <div className="flex justify-center items-center h-full">
                            <img
                                src={currentImage}
                                alt="Enlarged product image"
                                className="max-w-full max-h-[80vh] object-contain rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}