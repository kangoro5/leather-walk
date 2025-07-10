'use client';
import React, { useState } from 'react';
import { FaCreditCard, FaMobileAlt, FaPaypal, FaCheckCircle, FaLock, FaTruck } from 'react-icons/fa';

export default function CheckoutPage() {
  // Mock order data (replace with actual cart data, ideally passed as props or fetched)
  const [orderSummary, setOrderSummary] = useState({
    items: [
      { id: 1, name: "Classic Oxford", price: 12000, quantity: 1, image: "/images/shoe1.jpg" },
      { id: 2, name: "Modern Sneaker", price: 9500, quantity: 2, image: "/images/shoe2.jpg" },
    ],
    subtotal: 0,
    shippingCost: 500, // Example fixed shipping cost
    total: 0,
  });

  // Calculate subtotal and total based on items
  React.useEffect(() => {
    const newSubtotal = orderSummary.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setOrderSummary(prev => ({
      ...prev,
      subtotal: newSubtotal,
      total: newSubtotal + prev.shippingCost,
    }));
  }, [orderSummary.items]);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya', // Default country
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to 'Pay after delivery'
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Basic validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      alert('Please fill in all shipping details.');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    if (paymentMethod === 'mpesa' && (!mpesaNumber || mpesaNumber.length !== 10)) { // Simple Mpesa number validation
      alert('Please enter a valid 10-digit Mpesa number.');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    // In a real application, you would send this data to your backend
    console.log('Order Details:', {
      shippingInfo,
      paymentMethod,
      mpesaNumber: paymentMethod === 'mpesa' ? mpesaNumber : null,
      orderSummary,
    });

    alert('Order Placed Successfully! (This is a mock confirmation)');
    // Redirect to a confirmation page or clear cart
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-8 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-900 mb-8 text-center">Checkout</h1>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            {/* Shipping Information */}
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
                  <label htmlFor="address" className="block text-amber-800 text-sm font-semibold mb-2">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-amber-800 text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200"
                    placeholder="Nairobi"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-amber-800 text-sm font-semibold mb-2">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200"
                    placeholder="00100"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="country" className="block text-amber-800 text-sm font-semibold mb-2">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    readOnly // Make it read-only if it's always Kenya
                    className="w-full p-3 border border-amber-300 rounded-lg bg-amber-100 text-amber-900 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="lg:col-span-1 bg-amber-50 p-4 sm:p-8 rounded-2xl shadow-inner flex flex-col">
              {/* Order Summary */}
              <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-6 border-b pb-3 border-amber-200">Order Summary</h2>
              <div className="space-y-4 mb-8 flex-grow">
                {orderSummary.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-amber-800">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4 shadow-sm" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold">Ksh {(item.price * item.quantity).toLocaleString()}</p>
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
              </div>

              {/* Payment Method */}
              <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-6 border-b pb-3 border-amber-200">Payment Method</h2>
              <div className="space-y-4 mb-8">
                {/* Pay after delivery (default) */}
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

                {/* Mpesa Specific Form */}
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

                <label className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-amber-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="form-radio h-5 w-5 text-amber-600 border-amber-300 focus:ring-amber-500"
                  />
                  <FaPaypal className="ml-4 mr-3 text-amber-700 text-2xl" />
                  <span className="text-lg font-medium text-amber-900">PayPal</span>
                </label>
              </div>

              {/* Terms and Conditions */}
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

              {/* Place Order Button */}
              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3 text-lg sm:text-xl"
              >
                <FaCheckCircle /> Place Order
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
