'use client';
import React, { useState, useEffect, useCallback } from 'react'; // Import useEffect and useCallback
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import useAuth context

export default function CartPage() {
    const router = useRouter();
    const { user, isLoggedIn, loading: authLoading } = useAuth(); // Get user and isLoggedIn from AuthContext

    const [cart, setCart] = useState(null); // Initialize cart as null, will be populated by fetch
    const [loading, setLoading] = useState(true); // State for overall cart loading
    const [error, setError] = useState(null); // State for overall cart errors
    const [updating, setUpdating] = useState(false); // State for when quantities/removals are being processed

    // Function to fetch the user's cart
    const fetchUserCart = useCallback(async () => {
        if (!user || !user._id) {
            setLoading(false);
            setCart([]); // Set cart to empty if no user is logged in
            return;
        }

        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const res = await fetch(`http://localhost:8000/api/carts/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // If you're using tokens for authentication:
                    // 'Authorization': `Bearer ${user.token}`
                },
            });

            if (!res.ok) {
                if (res.status === 404) {
                    // No cart found for this user, which is a valid state
                    setCart([]);
                } else {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to fetch cart. Status: ${res.status}`);
                }
            } else {
                const data = await res.json();
                // Ensure data.products exists and is an array
                setCart(data.products || []);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err.message || 'Failed to load cart. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [user]); // Re-fetch when user object changes

    // useEffect to trigger cart fetch on component mount or user change
    useEffect(() => {
        // Only fetch if authLoading is false and user is available or explicitly not logged in
        if (!authLoading) {
            fetchUserCart();
        }
    }, [authLoading, user, fetchUserCart]); // Dependency array includes authLoading and user


    const updateCartOnBackend = useCallback(async (updatedProducts) => {
        if (!user || !user._id) {
            setError('Authentication error: User not identified. Please log in again.');
            return false;
        }

        setUpdating(true); // Start updating indicator
        setError(null); // Clear previous errors
        try {
            const res = await fetch(`http://localhost:8000/api/carts/${user._id}`, {
                method: 'PUT', // Use PUT to update the entire cart document
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user.token}` // Uncomment if using tokens
                },
                body: JSON.stringify({ userId: user._id, products: updatedProducts }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Failed to update cart. Status: ${res.status}`);
            }

            // Optionally, re-fetch the entire cart to ensure consistency
            // or just update local state if backend confirms the change.
            // For robustness, re-fetching is often better.
            await fetchUserCart(); // Re-fetch the cart after successful update
            return true;
        } catch (err) {
            console.error('Error updating cart:', err);
            setError(err.message || 'An error occurred while updating the cart.');
            return false;
        } finally {
            setUpdating(false); // End updating indicator
        }
    }, [user, fetchUserCart]); // Dependency on user and fetchUserCart

    const handleQuantityChange = async (productId, delta) => {
        if (!cart) return; // Do nothing if cart data isn't loaded yet

        const currentItem = cart.find(item => item.productId._id === productId);

        if (!currentItem) return; // Should not happen if UI is correctly mapped

        const newQuantity = Math.max(1, currentItem.quantity + delta);

        // Prevent quantity exceeding available stock (assuming selectedProduct has full product data)
        // You might need to fetch product details or ensure `currentItem.productId` has `quantity` (stock) property
        // For now, let's assume `currentItem.productId.quantity` refers to available stock.
        // If not, you might need to adjust your backend to include `stock` in cart item.
        // Or, you could pre-fetch all product details needed for display.
        // For simplicity, let's assume `currentItem.productId.quantity` is the available stock on the product model.
        // If your product in cart looks like: { productId: { _id, name, price, quantity: stock }, quantity: cart_quantity }
        const maxStock = currentItem.productId.quantity; // Assuming stock info is nested
        const clampedQuantity = Math.min(newQuantity, maxStock);

        if (clampedQuantity === currentItem.quantity) return; // No change if new quantity is same or clamped

        const updatedProducts = cart.map(item =>
            item.productId._id === productId
                ? { ...item, quantity: clampedQuantity }
                : item
        );

        // Optimistically update UI first for a snappier feel
        setCart(updatedProducts);
        const success = await updateCartOnBackend(updatedProducts);

        if (!success) {
            // Revert UI if update fails (or let fetchUserCart handle it if re-fetching on failure)
            await fetchUserCart(); // Re-fetch to sync with backend
        }
    };

    const handleRemove = async (productIdToRemove) => {
        if (!cart) return;

        const updatedProducts = cart.filter(item => item.productId._id !== productIdToRemove);

        // Optimistically update UI
        setCart(updatedProducts);
        const success = await updateCartOnBackend(updatedProducts);

        if (!success) {
            await fetchUserCart(); // Re-fetch to sync with backend
        }
    };

    const total = cart?.reduce((sum, item) => sum + item.productId.price * item.quantity, 0) || 0;


    // Redirect if not logged in and authLoading is false
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [authLoading, isLoggedIn, router]);

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

    // After loading and no error, if cart is null, it means there's no user or a redirect is pending.
    // If cart is an empty array, it means the cart is genuinely empty.
    if (!isLoggedIn) {
        // This case is typically handled by the useEffect redirect, but good for explicit handling
        return null; // Or a message "Please log in"
    }


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
                            {cart.map(item => (
                                <div key={item.productId._id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                                    <img
                                        src={item.productId.imageUrl || '/images/placeholder.jpg'} // Use product image
                                        alt={item.productId.name}
                                        className="w-20 h-20 object-contain rounded-lg bg-white flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-amber-900">{item.productId.name}</div>
                                        {/* Assuming size and color are properties on the product object */}
                                        <div className="text-sm text-amber-700 mb-1">
                                            {/* You might need to adjust this if size/color are not on product.productId */}
                                            {item.productId.size && `Size: ${item.productId.size}`}
                                            {item.productId.color && ` | Color: ${item.productId.color}`}
                                        </div>
                                        <div className="font-bold text-amber-800 mb-1">
                                            Ksh {item.productId.price.toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <button
                                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleQuantityChange(item.productId._id, -1)}
                                                aria-label="Decrease quantity"
                                                disabled={updating || item.quantity <= 1} // Disable if updating or quantity is 1
                                            >
                                                <FaMinus />
                                            </button>
                                            <span className="px-3 font-semibold">{item.quantity}</span>
                                            <button
                                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleQuantityChange(item.productId._id, 1)}
                                                aria-label="Increase quantity"
                                                disabled={updating || item.quantity >= item.productId.quantity} // Disable if updating or at max stock
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        {item.quantity >= item.productId.quantity && (
                                            <p className="text-red-500 text-xs mt-1">Max stock reached.</p>
                                        )}
                                        <div className="font-bold text-amber-900">
                                            Subtotal: Ksh {(item.productId.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleRemove(item.productId._id)}
                                        aria-label="Remove item"
                                        disabled={updating} // Disable during update
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
                                        <tr key={item.productId._id} className="border-b border-amber-100 hover:bg-amber-50/40 transition">
                                            <td className="py-4">
                                                <img
                                                    src={item.productId.imageUrl || '/images/placeholder.jpg'}
                                                    alt={item.productId.name}
                                                    className="w-20 h-20 object-contain rounded-lg shadow bg-white"
                                                />
                                            </td>
                                            <td className="py-4">
                                                <div className="font-semibold text-amber-900">{item.productId.name}</div>
                                                <div className="text-sm text-amber-700">
                                                    {item.productId.size && `Size: ${item.productId.size}`}
                                                    {item.productId.color && ` | Color: ${item.productId.color}`}
                                                </div>
                                            </td>
                                            <td className="py-4 font-bold text-amber-800">Ksh {item.productId.price.toLocaleString()}</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => handleQuantityChange(item.productId._id, -1)}
                                                        aria-label="Decrease quantity"
                                                        disabled={updating || item.quantity <= 1}
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="px-3 font-semibold">{item.quantity}</span>
                                                    <button
                                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => handleQuantityChange(item.productId._id, 1)}
                                                        aria-label="Increase quantity"
                                                        disabled={updating || item.quantity >= item.productId.quantity}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                                {item.quantity >= item.productId.quantity && (
                                                    <p className="text-red-500 text-xs mt-1">Max stock reached.</p>
                                                )}
                                            </td>
                                            <td className="py-4 font-bold text-amber-900">
                                                Ksh {(item.productId.price * item.quantity).toLocaleString()}
                                            </td>
                                            <td className="py-4">
                                                <button
                                                    className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => handleRemove(item.productId._id)}
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
                                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 md:px-10 rounded-full shadow-lg transition duration-200 text-lg w-full md:w-auto mt-4 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => router.push('/checkout')}
                                disabled={updating || cart.length === 0} // Disable if updating or cart is empty
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