'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaShoppingCart, FaUser, FaStore, FaEnvelope, FaPhoneAlt, FaSearch, FaBars, FaTimes } from "react-icons/fa";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        {/* Background overlay for subtle depth */}
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

        {/* Search Bar */}
        <div className="flex-grow hidden md:flex justify-center mx-4 relative z-10">
          <form className="flex w-full max-w-2xl rounded-full overflow-hidden shadow-lg border-2 border-[#e0c097] bg-[#3e2723]/80 backdrop-blur">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-grow p-3 bg-transparent text-white placeholder:text-[#e0c097] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#a67c52] hover:bg-[#ffd700] text-white hover:text-[#3e2723] p-3 rounded-r-full flex items-center justify-center transition-colors duration-200"
            >
              <FaSearch className="text-xl" />
            </button>
          </form>
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
            <li className="relative">
              <Link href="/cart" className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20">
                <FaShoppingCart className="text-xl" />
                Cart
                <span className="absolute -top-2 -right-4 bg-[#ffd700] text-[#3e2723] text-xs rounded-full px-2 font-bold shadow border border-white">2</span>
              </Link>
            </li>
            <li>
              <Link href="/account" className="flex items-center gap-2 text-white/90 hover:text-[#ffd700] transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-black/20">
                <FaUser className="text-xl" />
                Account
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2 bg-[#3e2723]/90 border-b border-[#e0c097]/30 flex items-center">
        <form className="flex w-full rounded-full overflow-hidden shadow-lg border-2 border-[#e0c097] bg-[#3e2723]/80 backdrop-blur">
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-grow p-3 bg-transparent text-white placeholder:text-[#e0c097] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#a67c52] hover:bg-[#ffd700] text-white hover:text-[#3e2723] p-3 rounded-r-full flex items-center justify-center transition-colors duration-200"
          >
            <FaSearch className="text-xl" />
          </button>
        </form>
      </div>

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
            <Link href="/cart" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2 relative" onClick={() => setMenuOpen(false)}>
              <FaShoppingCart className="text-xl" />
              Cart
              <span className="absolute -top-2 -right-4 bg-[#ffd700] text-[#3e2723] text-xs rounded-full px-2 font-bold shadow border border-white">2</span>
            </Link>
            <Link href="/account" className="flex items-center gap-3 text-white/90 hover:text-[#ffd700] text-lg font-semibold py-2" onClick={() => setMenuOpen(false)}>
              <FaUser className="text-xl" />
              Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
