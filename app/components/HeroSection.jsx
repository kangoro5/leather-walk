'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaStar, FaMinus, FaPlus, FaCheckCircle, FaSpinner, FaTimes, FaDollarSign } from "react-icons/fa"; // Import FaSpinner and FaTimes, FaDollarSign
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

export default function HeroSection() {
    const router = useRouter();
    // Destructure user from useAuth. 'user' will now be the full user object from AuthContext.
    const { isLoggedIn, user } = useAuth(); // <--- Get the user object here

    // State for fetched latest products, loading, and error status
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Initialize loading to true
    const [error, setError] = useState(null);

    // Modal state for Add to Cart
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false); // New state for add to cart loading
    const [addToCartError, setAddToCartError] = useState(null); // New state for add to cart error

    // --- useEffect to fetch latest 6 products from API ---
    useEffect(() => {
        const fetchLatestProducts = async () => {
            setLoading(true); // Start loading
            setError(null);   // Clear any previous errors
            try {
                // Fetch latest 6 products from the API.
                // Assuming your API supports limit and sorting by creation date.
                const res = await fetch('http://localhost:8000/api/products?limit=6&sortBy=createdAt:desc'); // Example API call

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to fetch products. Status: ${res.status}`);
                }

                const data = await res.json();
                setLatestProducts(data); // Set the fetched products
            } catch (err) {
                console.error("Error fetching latest products:", err);
                setError(err.message || 'Failed to load latest products. Please try again later.'); // Set the error message
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchLatestProducts();
    }, []); // Empty dependency array means this runs once on component mount

    const handleAddToCartClick = (product) => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setSelectedProduct(product);
        setQuantity(1);
        setAddToCartError(null); // Clear previous errors
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
        setAddToCartError(null); // Clear errors on close
    };

    const handleAddToCartConfirm = async () => { // <--- Made this async
        // Now 'user' from useAuth will contain the '_id'
        if (!selectedProduct || !user || !user._id) { // <--- Check for user and user._id
            setAddToCartError('Authentication error: User not identified. Please log in again.');
            return;
        }

        if (quantity <= 0 || quantity > selectedProduct.quantity) {
            setAddToCartError(`Please select a quantity between 1 and ${selectedProduct.quantity}.`);
            return;
        }

        setAddToCartLoading(true); // Start loading for add to cart
        setAddToCartError(null); // Clear previous errors

        try {
            const payload = {
                userId: user._id, // <--- Use user._id from context
                products: [
                    {
                        productId: selectedProduct._id,
                        quantity: quantity,
                        priceAtTimeOfAddition: selectedProduct.price // Include price at time of addition
                    }
                ]
            };

            // Fetch the user's current cart to determine if it's a POST or PUT
            const currentCartRes = await fetch(`http://localhost:8000/api/carts/${user._id}`);
            let currentCart = null;
            if (currentCartRes.ok) {
                const data = await currentCartRes.json();
                // Check if the cart is actually found (not just an empty object from 200 OK for no cart)
                if (data && data.products) { // Assuming your backend sends { products: [] } for empty cart
                    currentCart = data;
                }
            }
            
            let method = 'POST';
            let url = 'http://localhost:8000/api/carts';

            if (currentCart && currentCart.products) {
                // If cart exists, update existing product or add new one
                method = 'PUT';
                url = `http://localhost:8000/api/carts/${user._id}`;

                // Create a new products array for the PUT request
                let updatedProducts = [...currentCart.products];
                const existingProductIndex = updatedProducts.findIndex(
                    // Check if productId is populated or just the ID string
                    item => (item.productId && item.productId._id === selectedProduct._id) || (item.productId === selectedProduct._id)
                );

                if (existingProductIndex > -1) {
                    // Update quantity of existing product
                    updatedProducts[existingProductIndex] = {
                        productId: selectedProduct._id,
                        quantity: updatedProducts[existingProductIndex].quantity + quantity,
                        priceAtTimeOfAddition: selectedProduct.price
                    };
                } else {
                    // Add new product to cart
                    updatedProducts.push({
                        productId: selectedProduct._id,
                        quantity: quantity,
                        priceAtTimeOfAddition: selectedProduct.price
                    });
                }
                payload.products = updatedProducts; // Update payload with new product list
            }
            // If currentCart is null/empty, method remains POST and payload.products is already correct for a new cart.

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user.token}` // Uncomment if you have authentication tokens and send them
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to add item to cart.');
            }

            const cartData = await res.json();
            console.log('Item added to cart successfully:', cartData);

            setModalOpen(false);
            setSuccessModalOpen(true);
        } catch (err) {
            console.error('Error adding to cart:', err);
            setAddToCartError(err.message || 'An unexpected error occurred while adding to cart.');
        } finally {
            setAddToCartLoading(false); // End loading for add to cart
        }
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    return (
        <section className="relative bg-gradient-to-br from-amber-100 via-white to-amber-200 py-20 px-6 flex flex-col items-center text-center overflow-hidden">
            {/* Background image for subtle effect */}
            <div className="absolute inset-0 bg-[url('/images/hero-bg-shoes.png')] bg-no-repeat bg-right-bottom opacity-10 pointer-events-none bg-cover" />

            {/* Animations for modal and loading */}
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

            {/* Large Search Bar - Hide on mobile */}
            <div className="w-full max-w-3xl mb-10 z-10 hidden sm:block">
                <div className="flex w-full rounded-full overflow-hidden shadow-xl border-2 border-amber-300 focus-within:ring-4 focus-within:ring-amber-200 transition-all duration-300">
                    <span className="flex items-center px-6 bg-amber-100 text-amber-500">
                        <FaSearch className="text-xl md:text-2xl" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search for shoes, styles, or brands..."
                        className="flex-grow px-4 py-4 bg-white/95 text-amber-900 text-lg md:text-xl placeholder:text-amber-400 focus:outline-none"
                    />
                    <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-4 flex items-center justify-center transition-colors duration-200">
                        <FaSearch className="text-xl md:text-2xl" />
                    </button>
                </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 drop-shadow-lg mb-4">
                Step Into Style with <span className="text-amber-700">Leather Walk</span>
            </h1>
            <p className="text-lg md:text-2xl text-amber-800 mb-8 max-w-2xl mx-auto">
                Discover premium handcrafted leather shoes for every occasion. Elevate your walk with comfort, elegance, and timeless design.
            </p>
            <a
                href="/shop"
                className="inline-flex items-center justify-center bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-200 gap-3 text-lg md:text-xl mt-2"
                style={{ minWidth: 0 }}
            >
                <span className="flex items-center">
                    <FaShoppingCart className="text-xl mr-2" />
                    <span>Shop Now</span>
                </span>
            </a>

            ---

            {/* New Arrival/Trending Products Section */}
            <div className="mt-20 w-full max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center flex items-center justify-center gap-3">
                    <FaStar className="text-amber-500" />
                    New Arrival
                </h2>

                {loading && (
                    <div className="text-center text-amber-700 text-xl mt-10 flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin-fast text-5xl" />
                        Loading latest arrivals...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 text-xl mt-10 p-4 bg-red-100 border border-red-300 rounded-lg">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && latestProducts.length === 0 && (
                    <div className="text-amber-900 text-lg font-semibold mt-10 flex items-center justify-center gap-2">
                        No new arrivals available at the moment.
                    </div>
                )}

                {!loading && !error && latestProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {latestProducts.map((product) => (
                            <div key={product._id} className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center">
                                <img
                                    src={product.imageUrl || '/images/placeholder.jpg'} // Use imageUrl from API, fallback
                                    alt={product.name}
                                    className="w-full h-48 object-contain rounded-lg mb-4 bg-white"
                                />
                                <h3 className="text-lg font-semibold text-amber-900 mb-2">{product.name}</h3>
                                <p className="text-amber-700 font-bold mb-4 flex items-center gap-1">
                                    <FaDollarSign className="inline text-amber-500" /> Ksh {product.price.toLocaleString()}
                                </p>
                                {/* Only show 'Add to Cart' if there is stock */}
                                {product.quantity > 0 ? (
                                    <button
                                        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-200 flex items-center gap-2"
                                        onClick={() => handleAddToCartClick(product)}
                                    >
                                        <FaShoppingCart />
                                        Add to Cart
                                    </button>
                                ) : (
                                    <button
                                        className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-full shadow cursor-not-allowed flex items-center gap-2"
                                        disabled
                                    >
                                        Out of Stock
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* View More Button */}
                <div className="flex justify-center mt-10">
                    <a
                        href="/shop"
                        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200 flex items-center gap-3"
                    >
                        <FaStar className="text-lg" />
                        View All Products
                    </a>
                </div>
            </div>

            {/* Add to Cart Modal */}
            {modalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn px-2">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-scaleIn transition-all duration-300 ease-out mx-2">
                        <button
                            className="absolute top-4 right-4 text-amber-700 hover:text-red-600 text-2xl transition-colors duration-200"
                            onClick={handleModalClose}
                            aria-label="Close"
                        >
                            <FaTimes /> {/* Changed &times; to FaTimes */}
                        </button>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedProduct.imageUrl || '/images/placeholder.jpg'} // Use imageUrl
                                alt={selectedProduct.name}
                                className="w-40 h-40 object-contain rounded-lg mb-4 bg-white shadow"
                            />
                            <h2 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                                <FaShoppingCart className="text-amber-700" />
                                {selectedProduct.name}
                            </h2>
                            <p className="text-amber-700 font-semibold mb-1">
                                Ksh {selectedProduct.price.toLocaleString()}
                            </p>
                            <div className="flex flex-col items-center w-full">
                                <label className="mb-2 text-amber-900 font-medium" htmlFor="quantity">Quantity</label>
                                <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden mb-4">
                                    <button
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 transition-colors duration-200"
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        aria-label="Decrease quantity"
                                        disabled={addToCartLoading} // Disable while loading
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min={1}
                                        max={selectedProduct.quantity} // Max quantity is available stock
                                        value={quantity}
                                        onChange={e => setQuantity(Math.max(1, Math.min(selectedProduct.quantity, Number(e.target.value))))} // Clamp quantity
                                        className="w-16 px-2 py-2 text-amber-900 text-center text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        disabled={addToCartLoading} // Disable while loading
                                    />
                                    <button
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 transition-colors duration-200"
                                        onClick={() => setQuantity(prev => Math.min(selectedProduct.quantity, prev + 1))} // Clamp quantity
                                        aria-label="Increase quantity"
                                        disabled={addToCartLoading} // Disable while loading
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {addToCartError && ( // <--- Display add to cart error
                                    <p className="text-red-500 text-sm mb-2">{addToCartError}</p>
                                )}
                                {quantity > selectedProduct.quantity && (
                                    <p className="text-red-500 text-sm mt-2">Only {selectedProduct.quantity} available in stock.</p>
                                )}
                                <button
                                    className={`bg-amber-700 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200 w-full flex items-center justify-center gap-2
                                        ${(quantity <= 0 || quantity > selectedProduct.quantity || addToCartLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-800'}`}
                                    onClick={handleAddToCartConfirm}
                                    disabled={quantity <= 0 || quantity > selectedProduct.quantity || addToCartLoading} // Disable if invalid quantity or loading
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
                            <FaTimes /> {/* Changed &times; to FaTimes */}
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
        </section>
    );
}