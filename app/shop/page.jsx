'use client';
import React, { useState } from 'react';
import {
    FaSearch,
    FaDollarSign,
    FaShoePrints,
    FaPalette,
    FaTimes,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaCheckCircle
} from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// Example data (replace with real data or fetch from API)
const shoes = [
    { id: 1, name: "Classic Oxford", image: "/images/shoe1.jpg", price: 12000, size: 42, color: "Brown" },
    { id: 2, name: "Modern Sneaker", image: "/images/shoe2.jpg", price: 9500, size: 41, color: "Black" },
    { id: 3, name: "Vintage Brogue", image: "/images/shoe3.jpg", price: 13500, size: 43, color: "Tan" },
    { id: 4, name: "Elegant Loafer", image: "/images/shoe4.jpg", price: 11000, size: 42, color: "Brown" },
    { id: 5, name: "Urban Derby", image: "/images/shoe5.jpg", price: 12500, size: 44, color: "Black" },
    { id: 6, name: "Minimalist Boot", image: "/images/shoe6.jpg", price: 14000, size: 45, color: "Tan" },
    { id: 7, name: "Casual Slip-on", image: "/images/shoe1.jpg", price: 8000, size: 40, color: "Grey" },
    { id: 8, name: "Sporty Runner", image: "/images/shoe2.jpg", price: 10500, size: 42, color: "Blue" },
    { id: 9, name: "Formal Monk Strap", image: "/images/shoe3.jpg", price: 15000, size: 43, color: "Burgundy" },
];

const uniqueSizes = [...new Set(shoes.map(s => s.size))].sort((a, b) => a - b);
const uniqueColors = [...new Set(shoes.map(s => s.color))].sort();

export default function ShopPage() {
    const router = useRouter(); // Initialize useRouter
    const { isLoggedIn } = useAuth(); // Get isLoggedIn status from AuthContext

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShoe, setSelectedShoe] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const filteredShoes = shoes.filter(shoe => {
        return (
            (name === '' || shoe.name.toLowerCase().includes(name.toLowerCase())) &&
            (price === '' || shoe.price <= Number(price)) &&
            (size === '' || shoe.size === Number(size)) &&
            (color === '' || shoe.color === color)
        );
    });

    const handleAddToCartClick = (shoe) => {
        // --- NEW LOGIC HERE ---
        if (!isLoggedIn) {
            // If the user is not logged in, redirect them to the login page
            router.push('/login');
            return; // Stop the function here
        }
        // --- END NEW LOGIC ---

        // If logged in, proceed with opening the add-to-cart modal
        setSelectedShoe(shoe);
        setQuantity(1); // Reset quantity when opening modal for a new shoe
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedShoe(null);
    };

    const handleAddToCartConfirm = () => {
        // In a real application, you'd send the item and quantity to your backend here
        console.log(`Adding ${quantity} of ${selectedShoe.name} to cart.`);
        setModalOpen(false);
        setSuccessModalOpen(true);
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
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

            {/* Shoes Cards Section */}
            <div className="max-w-6xl mx-auto py-8 px-2 flex flex-wrap gap-6 md:gap-8 justify-center">
                {filteredShoes.length === 0 && (
                    <div className="text-amber-900 text-lg font-semibold mt-10 flex items-center gap-2">
                        <FaSearch className="text-amber-500" /> No shoes found matching your criteria.
                    </div>
                )}
                {filteredShoes.map(shoe => (
                    <div
                        key={shoe.id}
                        className="bg-white/90 rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center w-full max-w-xs sm:w-72 transform hover:scale-105 transition-transform duration-300"
                    >
                        <img
                            src={shoe.image}
                            alt={shoe.name}
                            className="w-full h-44 object-contain rounded-lg mb-4 bg-white shadow-inner"
                        />
                        <h3 className="text-lg font-semibold text-amber-900 mb-1">{shoe.name}</h3>
                        <p className="text-amber-700 font-bold mb-1 flex items-center gap-1">
                            <FaDollarSign className="inline text-amber-500" /> Ksh {shoe.price.toLocaleString()}
                        </p>
                        <div className="flex gap-3 text-sm text-amber-800 mb-4">
                            <span><FaShoePrints className="inline mr-1" />{shoe.size}</span>
                            <span><FaPalette className="inline mr-1" />{shoe.color}</span>
                        </div>
                        <button
                            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-200 flex items-center gap-2 w-full justify-center"
                            onClick={() => handleAddToCartClick(shoe)} // This button now triggers the check
                        >
                            <FaShoppingCart />
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Popup */}
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
                                src={selectedShoe.image}
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
                                <span><FaShoePrints className="inline mr-1" />{selectedShoe.size}</span>
                                <span><FaPalette className="inline mr-1" />{selectedShoe.color}</span>
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
        </div>
    );
}