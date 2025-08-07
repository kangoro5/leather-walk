'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FaCreditCard, FaMobileAlt, FaPaypal, FaCheckCircle, FaLock, FaTruck, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function CheckoutPage() {
    const { isLoggedIn, user, isAuthReady, loading: authLoading } = useAuth();
    const router = useRouter(); // Initialize router

    const [orderSummary, setOrderSummary] = useState({
        items: [],
        subtotal: 0,  
        shippingCost: 500, // Example fixed shipping cost
        total: 0,
    });   

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        phone: '',
        county: '',
        pickupStation: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const [error, setError] = useState(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New state for order placement loading

    const kenyanCounties = [
        "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay",
        "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
        "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
        "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
        "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
        "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
    ].sort();

    const mockPickupStations = [
        "Nairobi CBD - Shop 101",
        "Westlands - ABC Place",
        "Karen - The Hub",
        "Thika - Ananas Mall",
        "Mombasa - City Mall",
        "Kisumu - Mega City",
        "Nakuru - Prestige Plaza",
        "Eldoret - Zion Mall"
    ];

    const fetchUserCart = useCallback(async () => {
        if (!user || !user._id) {
            setIsLoadingCart(false);
            setOrderSummary(prev => ({ ...prev, items: [] }));
            setFormMessage({ type: 'info', text: 'Please log in to view your cart items.' });
            return;
        }

        setIsLoadingCart(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/api/carts/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user.token}` // Uncomment if needed
                },
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setOrderSummary(prev => ({ ...prev, items: [] }));
                    setFormMessage({ type: 'info', text: 'Your cart is empty.' });
                } else {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to fetch cart. Status: ${res.status}`);
                }
            } else {
                const data = await res.json();
                
                const normalizedItems = (data.products || []).map(item => ({
                    id: item.productId?._id || item.productId,
                    name: item.productId?.name,
                    price: item.productId?.price,
                    quantity: item.quantity,
                    image: item.productId?.imageUrl || `https://placehold.co/100x100/a67c52/ffffff?text=${item.productId?.name?.substring(0,2) || 'PR'}`,
                    size: item.productId?.size,
                    color: item.productId?.color,
                }));

                setOrderSummary(prev => ({ ...prev, items: normalizedItems }));
                setFormMessage({ type: '', text: '' });
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err.message || 'Failed to load cart. Please try again later.');
            setOrderSummary(prev => ({ ...prev, items: [] }));
        } finally {
            setIsLoadingCart(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            fetchUserCart();
        }
    }, [authLoading, user, fetchUserCart]);

    useEffect(() => {
        if (isAuthReady && isLoggedIn && user) {
            setShippingInfo(prev => ({
                ...prev,
                fullName: user.fullName || user.username || '',
                phone: user.phone || '',
            }));
        }
    }, [isAuthReady, isLoggedIn, user]);

    useEffect(() => {
        const newSubtotal = orderSummary.items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
        setOrderSummary(prev => ({
            ...prev,
            subtotal: newSubtotal,
            total: newSubtotal + prev.shippingCost,
        }));
    }, [orderSummary.items, orderSummary.shippingCost]);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
        setFormMessage({ type: '', text: '' });
    };

    const handlePlaceOrder = async (e) => { // Made async
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        // --- Frontend Validation ---
        if (!shippingInfo.fullName) {
            setFormMessage({ type: 'error', text: 'Please enter your full name.' });
            return; 
        }
        if (!shippingInfo.phone || !/^\d{10}$/.test(shippingInfo.phone)) {
            setFormMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
            return;
        }
        if (!shippingInfo.county) {
            setFormMessage({ type: 'error', text: 'Please select your county.' });
            return;
        }
        if (!shippingInfo.pickupStation) {
            setFormMessage({ type: 'error', text: 'Please select a pickup station.' });
            return;
        }
        if (!paymentMethod) {
            setFormMessage({ type: 'error', text: 'Please select a payment method.' });
            return;
        }
        if (paymentMethod === 'mpesa' && (!mpesaNumber || !/^\d{10}$/.test(mpesaNumber))) {
            setFormMessage({ type: 'error', text: 'Please enter a valid 10-digit Mpesa number.' });
            return;
        }
        if (!agreeTerms) {
            setFormMessage({ type: 'error', text: 'Please agree to the terms and conditions.' });
            return;
        }

        if (orderSummary.items.length === 0) {
            setFormMessage({ type: 'error', text: 'Your cart is empty. Please add items before placing an order.' });
            return;
        }

        setIsPlacingOrder(true); // Start loading for the button

        try {
            const orderData = {
                userId: user?._id, // Send userId in the body as middleware is removed
                products: orderSummary.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price // Send price for backend validation, though backend will use its own
                })),
                shippingInfo: {
                    fullName: shippingInfo.fullName,
                    phone: shippingInfo.phone,
                    county: shippingInfo.county,
                    pickupStation: shippingInfo.pickupStation,
                },
                paymentMethod: paymentMethod,
                mpesaNumber: paymentMethod === 'mpesa' ? mpesaNumber : null,
                totalAmount: orderSummary.total,
                subtotalAmount: orderSummary.subtotal,
                shippingCost: orderSummary.shippingCost,
            };

            console.log('Sending order data:', orderData);

            // --- API Call to Save Order ---
            const response = await fetch('http://localhost:8000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order.');
            }

            const result = await response.json();
            console.log('Order placed successfully:', result);

            // --- Clear Cart Locally ---
            // The backend's createOrder endpoint should handle clearing the cart on the server.
            // Here, we just clear the local state to reflect the change immediately.
            setOrderSummary(prev => ({
                ...prev,
                items: [],
                subtotal: 0,
                total: prev.shippingCost // Keep shipping cost if it's a base charge even for empty cart
            }));

            // Clear shipping info and payment method for a fresh form
            setShippingInfo({
                fullName: user.fullName || user.username || '',
                phone: user.phone || '',
                county: '',
                pickupStation: '',
            });
            setPaymentMethod('cod');
            setMpesaNumber('');
            setAgreeTerms(false);


            setFormMessage({ type: 'success', text: 'Order Placed Successfully! Your cart has been cleared.' });

            // Optionally, redirect to an order confirmation page
            // router.push(`/order-confirmation/${result._id}`); // if your backend returns order _id

        } catch (err) {
            console.error('Error placing order:', err);
            setFormMessage({ type: 'error', text: err.message || 'An unexpected error occurred while placing your order.' });
        } finally {
            setIsPlacingOrder(false); // End loading
        }
    };

    if (authLoading || isLoadingCart) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200">
                <FaSpinner className="animate-spin-fast text-amber-700 text-6xl" />
                <p className="ml-4 text-amber-800 text-xl">Loading your checkout details...</p>
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200">
                <p className="text-amber-800 text-xl">Please log in to proceed to checkout.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-8 px-2 sm:px-4 lg:px-8">
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-fast {
                    animation: spin 0.8s linear infinite;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 sm:p-8 md:p-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-900 mb-8 text-center">Checkout</h1>

                    <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                        <div className="lg:col-span-2 bg-amber-50 p-4 sm:p-8 rounded-2xl shadow-inner">
                            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-6 border-b pb-3 border-amber-200">Shipping Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-amber-800 text-sm font-semibold mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleShippingChange}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-amber-800 text-sm font-semibold mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleShippingChange}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200"
                                        placeholder="e.g., 0712345678"
                                        pattern="[0-9]{10}"
                                        title="Please enter a 10-digit phone number"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <label htmlFor="county" className="block text-amber-800 text-sm font-semibold mb-2">County</label>
                                    <select
                                        id="county"
                                        name="county"
                                        value={shippingInfo.county}
                                        onChange={handleShippingChange}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 transition-all duration-200 bg-white appearance-none pr-8"
                                        required
                                    >
                                        <option value="">Select County</option>
                                        {kenyanCounties.map(county => (
                                            <option key={county} value={county}>{county}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500 top-1/2 mt-2 transform -translate-y-1/2">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="pickupStation" className="block text-amber-800 text-sm font-semibold mb-2">Pickup Station</label>
                                    <select
                                        id="pickupStation"
                                        name="pickupStation"
                                        value={shippingInfo.pickupStation}
                                        onChange={handleShippingChange}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 transition-all duration-200 bg-white appearance-none pr-8"
                                        required
                                    >
                                        <option value="">Select Pickup Station</option>
                                        {mockPickupStations.map(station => (
                                            <option key={station} value={station}>{station}</option>
                                        ))}
                                    </select>
                                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500 top-1/2 mt-2 transform -translate-y-1/2">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 bg-amber-50 p-4 sm:p-8 rounded-2xl shadow-inner flex flex-col">
                            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-6 border-b pb-3 border-amber-200">Order Summary</h2>
                            <div className="space-y-4 mb-8 flex-grow">
                                {orderSummary.items.length === 0 ? (
                                    <div className="text-center py-8 text-amber-600">Your cart is empty.</div>
                                ) : (
                                    <>
                                        {orderSummary.items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between text-amber-800">
                                                <div className="flex items-center">
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4 shadow-sm" />
                                                    <div>
                                                        <p className="font-semibold">{item.name || 'Unknown Product'}</p>
                                                        <p className="text-sm">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold">Ksh {((item.price || 0) * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                        <div className="border-t border-amber-200 pt-4 space-y-2">
                                            <div className="flex justify-between text-amber-800">
                                                <span>Subtotal:</span>
                                                <span className="font-semibold">Ksh {orderSummary.subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-amber-800">
                                                <span>Shipping:</span>
                                                <span className="font-semibold">Ksh {orderSummary.shippingCost.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xl sm:text-2xl font-bold text-amber-900 pt-4 border-t border-amber-300">
                                                <span>Total:</span>
                                                <span>Ksh {orderSummary.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-6 border-b pb-3 border-amber-200">Payment Method</h2>
                            <div className="space-y-4 mb-8">
                                <label className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-amber-50 transition-colors duration-200">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="form-radio h-5 w-5 text-amber-600 border-amber-300 focus:ring-amber-500"
                                    />
                                    <FaTruck className="ml-4 mr-3 text-amber-700 text-2xl" />
                                    <span className="text-lg font-medium text-amber-900">Pay after delivery</span>
                                </label>

                                <label className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-amber-50 transition-colors duration-200">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                        className="form-radio h-5 w-5 text-amber-600 border-amber-300 focus:ring-amber-500"
                                    />
                                    <FaCreditCard className="ml-4 mr-3 text-amber-700 text-2xl" />
                                    <span className="text-lg font-medium text-amber-900">Credit/Debit Card</span>
                                </label>

                                <label className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-amber-50 transition-colors duration-200">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="mpesa"
                                        checked={paymentMethod === 'mpesa'}
                                        onChange={() => setPaymentMethod('mpesa')}
                                        className="form-radio h-5 w-5 text-amber-600 border-amber-300 focus:ring-amber-500"
                                    />
                                    <FaMobileAlt className="ml-4 mr-3 text-amber-700 text-2xl" />
                                    <span className="text-lg font-medium text-amber-900">Mpesa</span>
                                </label>

                                {paymentMethod === 'mpesa' && (
                                    <div className="bg-amber-100 p-6 rounded-lg shadow-inner mt-4 animate-fadeIn">
                                        <p className="text-amber-800 text-sm mb-4">
                                            Please confirm your Mpesa number. An STK Push will be sent to this number for payment.
                                        </p>
                                        <div className="mb-4">
                                            <label htmlFor="mpesaNumber" className="block text-amber-800 text-sm font-semibold mb-2">Mpesa Number</label>
                                            <input
                                                type="tel"
                                                id="mpesaNumber"
                                                value={mpesaNumber}
                                                onChange={(e) => setMpesaNumber(e.target.value)}
                                                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200"
                                                placeholder="e.g., 0712345678"
                                                required
                                                pattern="[0-9]{10}"
                                                title="Please enter a 10-digit Mpesa number"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="mpesaAmount" className="block text-amber-800 text-sm font-semibold mb-2">Amount to Pay</label>
                                            <input
                                                type="text"
                                                id="mpesaAmount"
                                                value={`Ksh ${orderSummary.total.toLocaleString()}`}
                                                readOnly
                                                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-200 text-amber-900 font-bold cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center mb-6">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                                    required
                                />
                                <label htmlFor="agreeTerms" className="ml-3 text-amber-800 text-sm">
                                    I agree to the <a href="#" className="text-amber-700 hover:underline font-semibold">terms and conditions</a>
                                </label>
                            </div>

                            {formMessage.text && (
                                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${formMessage.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' : formMessage.type === 'info' ? 'bg-blue-100 text-blue-700 border border-blue-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                                    {formMessage.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
                                    {formMessage.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3 text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoadingCart || orderSummary.items.length === 0 || isPlacingOrder} // Disable if placing order
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <FaSpinner className="animate-spin-fast" /> Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle /> Place Order
                                    </>
                                )}
                            </button>
                            <p className="text-center text-amber-700 text-sm mt-4 flex items-center justify-center gap-2">
                                <FaLock className="text-lg" /> Secure Payment
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}