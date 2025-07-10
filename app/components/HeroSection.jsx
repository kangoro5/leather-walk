'use client';
import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaStar, FaMinus, FaPlus, FaCheckCircle } from "react-icons/fa";

export default function HeroSection() {
    // Example products array (replace with real data or props)
    const products = [
        {
            id: 1,
            name: "Classic Oxford",
            image: "/images/shoe1.jpg",
            price: 12000,
        },
        {
            id: 2,
            name: "Modern Sneaker",
            image: "/images/shoe2.jpg",
            price: 9500,
        },
        {
            id: 3,
            name: "Vintage Brogue",
            image: "/images/shoe3.jpg",
            price: 13500,
        },
        {
            id: 4,
            name: "Elegant Loafer",
            image: "/images/shoe4.jpg",
            price: 11000,
        },
        {
            id: 5,
            name: "Urban Derby",
            image: "/images/shoe5.jpg",
            price: 12500,
        },
        {
            id: 6,
            name: "Minimalist Boot",
            image: "/images/shoe6.jpg",
            price: 14000,
        },
    ];

    // Modal state for Add to Cart
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const handleAddToCartClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleAddToCartConfirm = () => {
        setModalOpen(false);
        setSuccessModalOpen(true);
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    return (
        <section className="relative bg-gradient-to-br from-amber-100 via-white to-amber-200 py-20 px-6 flex flex-col items-center text-center overflow-hidden">
            {/* Background image for subtle effect */}
            <div className="absolute inset-0 bg-[url('/images/hero-bg-shoes.png')] bg-no-repeat bg-right-bottom opacity-10 pointer-events-none bg-cover" />

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
            {/* Trending/New Products Section */}
            <div className="mt-20 w-full max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center flex items-center justify-center gap-3">
                    <FaStar className="text-amber-500" />
                    New Arrival
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.slice(0, 6).map((product) => (
                        <div key={product.id} className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-contain rounded-lg mb-4 bg-white"
                            />
                            <h3 className="text-lg font-semibold text-amber-900 mb-2">{product.name}</h3>
                            <p className="text-amber-700 font-bold mb-4">Ksh {product.price.toLocaleString()}</p>
                            <button
                                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-200 flex items-center gap-2"
                                onClick={() => handleAddToCartClick(product)}
                            >
                                <FaShoppingCart />
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
                {/* View More Button */}
                <div className="flex justify-center mt-10">
                    <a
                        href="/shop"
                        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200 flex items-center gap-3"
                    >
                        <FaStar className="text-lg" />
                        View More
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
                            ×
                        </button>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedProduct.image}
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
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-16 px-2 py-2 text-amber-900 text-center text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 transition-colors duration-200"
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <button
                                    className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200 w-full flex items-center justify-center gap-2"
                                    onClick={handleAddToCartConfirm}
                                >
                                    <FaShoppingCart />
                                    Add to Cart
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
                            ×
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
