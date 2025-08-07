'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FaTrashAlt, FaShoppingCart, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
    const router = useRouter();
    const { user, isLoggedIn, loading: authLoading } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    // --- fetchUserCart: Corrected to handle null product IDs gracefully ---
    const fetchUserCart = useCallback(async () => {
        if (!user || !user._id) {
            setLoading(false);
            setCart([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/api/carts/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Consider adding 'Authorization' header if your backend requires it
                    // 'Authorization': `Bearer ${user.token}`
                },
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setCart([]); // Cart not found, treat as empty
                } else {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to fetch cart. Status: ${res.status}`);
                }
            } else {
                const data = await res.json();

                // *** CRITICAL FIX: Filter out items with null/undefined productId first ***
                const validCartItems = (data.products || []).filter(item => item.productId);

                // Now map over the filtered, valid items, safely accessing properties
                const normalizedProducts = validCartItems.map(item => ({
                    productId: item.productId._id || item.productId,
                    quantity: item.quantity,
                    // Use optional chaining for safety, in case the product is not fully populated
                    name: item.productId?.name,
                    imageUrl: item.productId?.imageUrl,
                    price: item.productId?.price,
                    size: item.productId?.size,
                    color: item.productId?.color,
                }));
                
                setCart(normalizedProducts);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err.message || 'Failed to load cart. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [user]); // Re-run if user changes

    useEffect(() => {
        if (!authLoading) {
            fetchUserCart();
        }
    }, [authLoading, user, fetchUserCart]);

    // --- updateCartOnBackend: Corrected payload for PUT request ---
    const updateCartOnBackend = useCallback(async (productsToUpdate) => {
        if (!user || !user._id) {
            setError('Authentication error: User not identified. Please log in again.');
            return false;
        }

        setUpdating(true);
        setError(null);
        try {
            const payloadProducts = productsToUpdate.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                // priceAtTimeOfAddition: item.priceAtTimeOfAddition // Uncomment if your schema needs this
            }));

            const res = await fetch(`http://localhost:8000/api/carts/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ products: payloadProducts }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Backend error response on update:", errorData);
                throw new Error(errorData.message || `Failed to update cart. Status: ${res.status}`);
            }

            await fetchUserCart();
            return true;
        } catch (err) {
            console.error('Error updating cart:', err);
            setError(err.message || 'An error occurred while updating the cart.');
            return false;
        } finally {
            setUpdating(false);
        }
    }, [user, fetchUserCart]);

    // --- handleRemove: Uses normalized product IDs ---
    const handleRemove = async (productIdToRemove) => {
        if (!cart) return;
        const updatedProducts = cart.filter(item => item.productId !== productIdToRemove);
        setCart(updatedProducts);
        const success = await updateCartOnBackend(updatedProducts);
        if (!success) {
            await fetchUserCart();
        }
    };

    // --- total calculation: Safer access to price ---
    const total = cart?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0;

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [authLoading, isLoggedIn, router]);

    // --- Loading and Error States ---
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200">
                <FaSpinner className="animate-spin-fast text-amber-700 text-6xl" />
                <p className="ml-4 text-amber-800 text-xl">Loading cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200 p-6">
                <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <FaExclamationCircle className="inline mr-2 text-2xl" />
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                    <button onClick={fetchUserCart} className="mt-4 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    // --- Render Cart Content ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-6 px-2 md:py-10 md:px-4">
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-fast {
                    animation: spin 0.8s linear infinite;
                }
            `}</style>
            <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-4 md:p-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900 mb-6 md:mb-8 flex items-center gap-3">
                    <FaShoppingCart className="text-amber-700" /> Your Cart
                </h1>
                {(cart && cart.length === 0) ? (
                    <div className="text-center text-amber-700 text-lg md:text-xl font-semibold py-16 md:py-20">
                        Your cart is empty.
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {updating && (
                            <div className="flex items-center justify-center text-amber-700 text-lg mb-4">
                                <FaSpinner className="animate-spin-fast mr-2" /> Updating cart...
                            </div>
                        )}
                        {/* Mobile Card List */}
                        <div className="md:hidden flex flex-col gap-4 mb-8">
                            {cart?.map(item => (
                                <div key={item.productId} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                                    <img
                                        src={item.imageUrl || '/images/placeholder.jpg'}
                                        alt={item.name}
                                        className="w-20 h-20 object-contain rounded-lg bg-white flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-amber-900">{item.name}</div>
                                        <div className="text-sm text-amber-700 mb-1">
                                            {item.size && `Size: ${item.size}`}
                                            {item.color && ` | Color: ${item.color}`}
                                        </div>
                                        <div className="font-bold text-amber-800 mb-1">
                                            Ksh {item.price?.toLocaleString() || 'N/A'}
                                        </div>
                                        <div className="text-amber-900 font-semibold">
                                            Quantity: {item.quantity}
                                        </div>
                                        <div className="font-bold text-amber-900">
                                            Subtotal: Ksh {((item.price || 0) * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleRemove(item.productId)}
                                        aria-label="Remove item"
                                        disabled={updating}
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
                                    {cart?.map(item => (
                                        <tr key={item.productId} className="border-b border-amber-100 hover:bg-amber-50/40 transition">
                                            <td className="py-4">
                                                <img
                                                    src={item.imageUrl || '/images/placeholder.jpg'}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-contain rounded-lg shadow bg-white"
                                                />
                                            </td>
                                            <td className="py-4">
                                                <div className="font-semibold text-amber-900">{item.name}</div>
                                                <div className="text-sm text-amber-700">
                                                    {item.size && `Size: ${item.size}`}
                                                    {item.color && ` | Color: ${item.color}`}
                                                </div>
                                            </td>
                                            <td className="py-4 font-bold text-amber-800">Ksh {item.price?.toLocaleString() || 'N/A'}</td>
                                            <td className="py-4 text-amber-900 font-semibold">
                                                {item.quantity}
                                            </td>
                                            <td className="py-4 font-bold text-amber-900">
                                                Ksh {((item.price || 0) * item.quantity).toLocaleString()}
                                            </td>
                                            <td className="py-4">
                                                <button
                                                    className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => handleRemove(item.productId)}
                                                    aria-label="Remove item"
                                                    disabled={updating}
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
                                onClick={() => router.push('/checkout')}
                                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 md:px-10 rounded-full shadow-lg transition duration-200 text-lg w-full md:w-auto mt-4 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={updating || cart?.length === 0}
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
