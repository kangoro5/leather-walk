'use client';
import React, { useState } from 'react';
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Example cart data (replace with real cart state or fetch from API)
const initialCart = [
  {
    id: 1,
    name: "Classic Oxford",
    image: "/images/shoe1.jpg",
    price: 12000,
    size: 42,
    color: "Brown",
    quantity: 1,
  },
  {
    id: 2,
    name: "Modern Sneaker",
    image: "/images/shoe2.jpg",
    price: 9500,
    size: 41,
    color: "Black",
    quantity: 2,
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const router = useRouter();

  const handleQuantityChange = (id, delta) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-6 px-2 md:py-10 md:px-4">
      <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900 mb-6 md:mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-amber-700" /> Your Cart
        </h1>
        {cart.length === 0 ? (
          <div className="text-center text-amber-700 text-lg md:text-xl font-semibold py-16 md:py-20">
            Your cart is empty.
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="md:hidden flex flex-col gap-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg bg-white flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-amber-900">{item.name}</div>
                    <div className="text-sm text-amber-700 mb-1">
                      Size: {item.size} | Color: {item.color}
                    </div>
                    <div className="font-bold text-amber-800 mb-1">
                      Ksh {item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="font-bold text-amber-900">
                      Total: Ksh {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 p-2"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left mb-8">
                <thead>
                  <tr className="text-amber-900 border-b border-amber-200">
                    <th className="py-3">Product</th>
                    <th className="py-3">Details</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Total</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id} className="border-b border-amber-100 hover:bg-amber-50/40 transition">
                      <td className="py-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-lg shadow bg-white"
                        />
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-amber-900">{item.name}</div>
                        <div className="text-sm text-amber-700">Size: {item.size} | Color: {item.color}</div>
                      </td>
                      <td className="py-4 font-bold text-amber-800">Ksh {item.price.toLocaleString()}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>
                          <span className="px-3 font-semibold">{item.quantity}</span>
                          <button
                            className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-amber-900">
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <button
                          className="text-red-600 hover:text-red-800 p-2"
                          onClick={() => handleRemove(item.id)}
                          aria-label="Remove item"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Cart Summary */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
              <div className="text-lg md:text-xl font-bold text-amber-900">
                Total: <span className="text-amber-700">Ksh {total.toLocaleString()}</span>
              </div>
              <button
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 md:px-10 rounded-full shadow-lg transition duration-200 text-lg w-full md:w-auto mt-4 md:mt-0"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}