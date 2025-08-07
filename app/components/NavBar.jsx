'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

import { FaHome, FaShoppingCart, FaUser, FaStore, FaEnvelope, FaPhoneAlt, FaBars, FaTimes, FaSignInAlt, FaSignOutAlt, FaSpinner, FaCaretDown } from "react-icons/fa";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0); 
    const { isLoggedIn, user, logout, isAuthReady } = useAuth();
    const router = useRouter();
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAccountDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // --- New useEffect to fetch cart count ---
    useEffect(() => {
        const fetchCartCount = async () => {
            if (isLoggedIn && user && user._id) { 
                try {
                    const response = await fetch(`http://localhost:8000/api/carts/${user._id}`); 
                    
                    if (!response.ok) {
                        if (response.status === 404) {
                            setCartItemCount(0);
                            return;
                        }
                        throw new Error(`Failed to fetch cart: ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    const totalItems = data.products.reduce((sum, item) => sum + item.quantity, 0);
                    setCartItemCount(totalItems);

                } catch (error) {
                    console.error("Error fetching cart count:", error);
                    setCartItemCount(0);
                }
            } else {
                setCartItemCount(0);
            }
        };

        fetchCartCount(); 
        
    }, [isLoggedIn, user, isAuthReady]);

    const handleSignInClick = () => {
        router.push('/login');
        setMenuOpen(false);
        setAccountDropdownOpen(false);
    };

    const handleLogoutClick = () => {
        logout();
        router.push('/login');
        setMenuOpen(false);
        setAccountDropdownOpen(false);
        setCartItemCount(0);
    };

    // Helper function to render authentication-related links (desktop & mobile)
    const renderAuthLinks = (isMobile = false) => {
        if (!isAuthReady) {
            return (
                <li className={isMobile ? "" : "flex items-center"}>
                    <span className={`flex items-center gap-2 ${isMobile ? 'text-lg font-semibold py-2' : 'px-3 py-1'} text-white/90`}>
                        <FaSpinner className="animate-spin" /> Loading...
                    </span>
                </li>
            );
        }

        if (isLoggedIn) {
            // Desktop view with dropdown for Account/Sign Out
            if (!isMobile) {
                return (
                    <>
                        {/* Account Dropdown */}
                        <li className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                                className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20"
                                aria-haspopup="true"
                                aria-expanded={accountDropdownOpen ? "true" : "false"}
                            >
                                <FaUser className="text-xl" />
                                Account
                                <FaCaretDown className={`ml-1 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {accountDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => { setAccountDropdownOpen(false); setMenuOpen(false); }}
                                    >
                                        <FaUser /> My Account
                                    </Link>
                                    <button
                                        onClick={handleLogoutClick}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    >
                                        <FaSignOutAlt /> Sign Out
                                    </button>
                                </div>
                            )}
                        </li>
                    </>
                );
            } else {
                // Mobile view (separate links within the drawer)
                return (
                    <>
                        <li>
                            <Link href="/account" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2" onClick={() => setMenuOpen(false)}>
                                <FaUser className="text-xl" />
                                My Account
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogoutClick}
                                className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2 bg-amber-700 hover:bg-amber-800 rounded-lg justify-center w-full"
                            >
                                <FaSignOutAlt className="text-xl" />
                                Sign Out
                            </button>
                        </li>
                    </>
                );
            }
        } else {
            // Not logged in (Sign In button)
            return (
                <li>
                    <button
                        onClick={handleSignInClick}
                        className={`flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer ${isMobile ? 'text-lg font-semibold py-2 bg-amber-700 hover:bg-amber-800 rounded-lg justify-center w-full' : 'px-3 py-1 rounded-lg hover:bg-black/20 bg-amber-700 hover:bg-amber-800'}`}
                    >
                        <FaSignInAlt className="text-xl" />
                        Sign In
                    </button>
                </li>
            );
        }
    };

    return (
        <>
            {/* Top contact bar */}
            <div className="w-full bg-[#3e2723] text-white text-xs md:text-sm px-4 md:px-10 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-4 md:gap-6">
                    <span className="flex items-center gap-2">
                        <FaPhoneAlt className="text-xs" />
                        <a href="tel:+254712345678" className="hover:underline">+254 712 345678</a>
                    </span>
                    <span className="flex items-center gap-2">
                        <FaEnvelope className="text-xs" />
                        <a href="mailto:info@leatherwalk.co.ke" className="hover:underline">info@leatherwalk.co.ke</a>
                    </span>
                </div>
                <span className="hidden md:inline">Premium Leather Shoes | Free Delivery in Nairobi</span>
            </div>

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#3e2723] via-[#a67c52] to-[#8d6748] bg-opacity-95 backdrop-blur-md shadow-xl px-4 md:px-10 py-3 flex items-center justify-between border-b border-[#e0c097]/40 relative">
                <div className="absolute inset-0 bg-black/20 pointer-events-none z-0 rounded-b-xl" />

                {/* Logo & Hamburger */}
                <div className="flex items-center gap-3 md:gap-4 relative z-10">
                    <button
                        className="md:hidden text-white text-2xl mr-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Open menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <img
                        src="https://placehold.co/48x48/a67c52/ffffff?text=LW"
                        alt="Leather Walk Logo"
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg border-2 border-[#e0c097]"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/a67c52/ffffff?text=LW' }}
                    />
                    <span className="text-2xl md:text-3xl font-black text-white tracking-widest drop-shadow-lg font-serif">Leather Walk</span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center space-x-1 relative z-10">
                    <ul className="flex items-center gap-8 font-semibold">
                        <li>
                            <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20">
                                <FaHome className="text-xl" />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20">
                                <FaStore className="text-xl" />
                                Shop
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20">
                                <FaUser className="text-xl" />
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20">
                                <FaEnvelope className="text-xl" />
                                Contact
                            </Link>
                        </li>
                        {/* Cart Link for Desktop */}
                        <li className="relative">
                            <Link href="/cart" className={`flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20`} onClick={() => setMenuOpen(false)}>
                                <FaShoppingCart className="text-xl" />
                                Cart
                                {cartItemCount > 0 && ( 
                                    <span className="absolute -top-2 -right-4 bg-[#ffd700] text-[#3e2723] text-xs rounded-full px-2 font-bold shadow border border-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        {renderAuthLinks(false)} {/* Only render account dropdown/sign-in for desktop here */}
                    </ul>
                </div>

                {/* Mobile Cart Icon (always visible on small screens) */}
                <div className="md:hidden relative z-10 mr-4"> {/* Added mr-4 for spacing from menu icon */}
                    <Link href="/cart" className="flex items-center text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer text-2xl" onClick={() => setMenuOpen(false)}>
                        <FaShoppingCart />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#ffd700] text-[#3e2723] text-xs rounded-full px-2 py-0.5 font-bold shadow border border-white">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setMenuOpen(false)}>
                    <div
                        className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-gradient-to-b from-[#3e2723] via-[#a67c52] to-[#8d6748] shadow-xl p-6 flex flex-col gap-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="self-end text-white text-2xl mb-4"
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <FaTimes />
                        </button>
                        <Link href="/" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2" onClick={() => setMenuOpen(false)}>
                            <FaHome className="text-xl" />
                            Home
                        </Link>
                        <Link href="/shop" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2" onClick={() => setMenuOpen(false)}>
                            <FaStore className="text-xl" />
                            Shop
                        </Link>
                        <Link href="/about" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2" onClick={() => setMenuOpen(false)}>
                            <FaUser className="text-xl" />
                            About
                        </Link>
                        <Link href="/contact" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2" onClick={() => setMenuOpen(false)}>
                            <FaEnvelope className="text-xl" />
                            Contact
                        </Link>
                        {renderAuthLinks(true)} {/* This will now correctly render account/sign-out for mobile */}
                    </div>
                </div>
            )}
        </>
    );
}