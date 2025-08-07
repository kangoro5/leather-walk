'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { FaUserCircle, FaClipboardList, FaMapMarkerAlt, FaCog, FaSignOutAlt, FaTachometerAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Using the updated AuthContext

export default function MyAccountPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [userError, setUserError] = useState(null);

    const router = useRouter();
    const { logout, getToken } = useAuth(); // Destructuring getToken from the context

    const handleLogout = () => {
        console.log('Logging out...');
        logout();
        setCurrentUser(null); // Clear current user data from state
        router.push('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setLoadingUser(true);
            setUserError(null);
            
            const authToken = getToken();

            if (!authToken) {
                console.warn('No authentication token found. Redirecting to login.');
                router.push('/login');
                setLoadingUser(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });

                if (response.data) {
                    setCurrentUser(response.data);
                } else {
                    setUserError('User data not found in response from server.');
                    handleLogout();
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                if (error.response && error.response.status === 401) {
                    setUserError('Session expired. Please log in again.');
                    handleLogout();
                } else if (error.response && error.response.status === 404) {
                    setUserError('User not found. Please log in again.');
                    handleLogout();
                }
                else {
                    setUserError('Failed to load user profile. Please check your internet connection or try again later.');
                }
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, [router, getToken, handleLogout]);

    const orders = [
        { id: 'ORD001', date: '2024-06-15', total: 24000, status: 'Delivered', items: 1, image: 'https://placehold.co/80x80/ffe4e6/8b5cf6?text=Shoe' },
        { id: 'ORD002', date: '2024-07-01', total: 9500, status: 'Processing', items: 1, image: 'https://placehold.co/80x80/e6f7ff/2563eb?text=Shoe' },
        { id: 'ORD003', date: '2024-07-05', total: 13500, status: 'Shipped', items: 1, image: 'https://placehold.co/80x80/e0e7ff/6366f1?text=Shoe' },
    ];

    const addresses = [
        { id: 1, type: 'Home', fullName: 'Jane Doe', address: '123 Main Street', city: 'Nairobi', postalCode: '00100', country: 'Kenya' },
        { id: 2, type: 'Work', fullName: 'Jane Doe', address: '456 Business Avenue', city: 'Nairobi', postalCode: '00100', country: 'Kenya' },
    ];

    const renderContent = () => {
        if (loadingUser) {
            return (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-amber-700" />
                    <p className="ml-4 text-xl text-amber-800">Loading user data...</p>
                </div>
            );
        }

        if (userError) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{userError}</span>
                    {userError.includes("session expired") || userError.includes("not found") ? (
                        <p className="mt-2">Please log in again.</p>
                    ) : (
                        <p className="mt-2">If the problem persists, contact support.</p>
                    )}
                </div>
            );
        }

        if (!currentUser) {
            return (
                <div className="text-center text-amber-800 text-lg p-8">
                    <p>User data not available. Please log in to view your account.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-full"
                    >
                        Go to Login
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
                        <h2 className="text-3xl font-bold text-amber-900 mb-6">Welcome, {currentUser.username || currentUser.fullName || 'User'}!</h2>
                        <p className="text-amber-800 text-lg mb-4">This is your personal dashboard. Here you can quickly access your account information and recent activities.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-amber-50 p-6 rounded-xl shadow-md flex items-center gap-4">
                                <FaClipboardList className="text-amber-700 text-4xl" />
                                <div>
                                    <h3 className="text-xl font-semibold text-amber-900">Recent Orders</h3>
                                    <p className="text-amber-800">You have {orders.length} orders. <a href="#" onClick={() => setActiveTab('orders')} className="text-amber-700 hover:underline">View all</a></p>
                                </div>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-xl shadow-md flex items-center gap-4">
                                <FaUserCircle className="text-amber-700 text-4xl" />
                                <div>
                                    <h3 className="text-xl font-semibold text-amber-900">Profile Details</h3>
                                    <p className="text-amber-800">Manage your personal information. <a href="#" onClick={() => setActiveTab('profile')} className="text-amber-700 hover:underline">Edit profile</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
                        <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">My Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-amber-800 text-sm font-semibold mb-2">Full Name</label>
                                <input type="text" value={currentUser.fullname || ''} readOnly className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-900 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-amber-800 text-sm font-semibold mb-2">Email</label>
                                <input type="email" value={currentUser.email || ''} readOnly className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-900 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-amber-800 text-sm font-semibold mb-2">Phone Number</label>
                                <input type="tel" value={currentUser.phone || ''} readOnly className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-900 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-amber-800 text-sm font-semibold mb-2">Member Since</label>
                                <input type="text" value={currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'} readOnly className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-900 cursor-not-allowed" />
                            </div>
                        </div>
                        <button className="mt-8 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-200">
                            Edit Profile
                        </button>
                    </div>
                );
            case 'orders':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
                        <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">My Orders</h2>
                        {orders.length === 0 ? (
                            <p className="text-amber-800">You haven't placed any orders yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-amber-50 p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center md:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <img src={order.image} alt="Product" className="w-20 h-20 object-cover rounded-md shadow-sm" />
                                            <div>
                                                <p className="font-semibold text-amber-900">Order ID: {order.id}</p>
                                                <p className="text-sm text-amber-800">Date: {order.date}</p>
                                                <p className="text-sm text-amber-800">Items: {order.items}</p>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-xl font-bold text-amber-700">Ksh {order.total.toLocaleString()}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                                                order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                                                order.status === 'Processing' ? 'bg-blue-200 text-blue-800' :
                                                'bg-orange-200 text-orange-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                            <button className="ml-4 bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-4 rounded-full transition duration-200">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="mt-8 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-200">
                            Add New Address
                        </button>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
                        <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">My Addresses</h2>
                        {addresses.length === 0 ? (
                            <p className="text-amber-800">You haven't added any addresses yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.map(address => (
                                    <div key={address.id} className="bg-amber-50 p-6 rounded-xl shadow-md">
                                        <h3 className="text-xl font-semibold text-amber-900 mb-2">{address.type} Address</h3>
                                        <p className="text-amber-800">{address.fullName}</p>
                                        <p className="text-amber-800">{address.address}</p>
                                        <p className="text-amber-800">{address.city}, {address.postalCode}</p>
                                        <p className="text-amber-800">{address.country}</p>
                                        <div className="mt-4 flex gap-3">
                                            <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-4 rounded-full transition duration-200">
                                                Edit
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-full transition duration-200">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="mt-8 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-200">
                            Add New Address
                        </button>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
                        <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">Account Settings</h2>
                        <p className="text-amber-800">Here you can manage your account preferences, notifications, and security settings.</p>
                        <div className="mt-6 space-y-4">
                            <button className="w-full text-left bg-amber-50 hover:bg-amber-100 p-4 rounded-lg shadow-sm text-amber-900 font-medium transition-colors duration-200">
                                Change Password
                            </button>
                            <button className="w-full text-left bg-amber-50 hover:bg-amber-100 p-4 rounded-lg shadow-sm text-amber-900 font-medium transition-colors duration-200">
                                Notification Preferences
                            </button>
                            <button className="w-full text-left bg-amber-50 hover:bg-amber-100 p-4 rounded-lg shadow-sm text-amber-900 font-medium transition-colors duration-200">
                                Privacy Controls
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>

            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                {/* Sidebar Navigation */}
                <div className="lg:w-1/4 bg-[#442a1f] p-8 text-white flex flex-col justify-between">
                    <div>
                        {/* A new div for the Logo */}
                        <div className="mb-8">
                            <img
                                src="https://placehold.co/150x50/ffffff/442a1f?text=Your+Logo"
                                alt="Company Logo"
                                className="w-auto h-12"
                            />
                        </div>
                        <div className="flex items-center mb-8">
                            <FaUserCircle className="text-6xl text-amber-200 mr-4" />
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {loadingUser ? 'Loading...' : currentUser?.username || currentUser?.fullName || 'Guest'}
                                </h2>
                                <p className="text-amber-100 text-sm">
                                    {loadingUser ? 'Loading...' : currentUser?.email || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <nav className="space-y-3">
                            <button
                                className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${
                                    activeTab === 'dashboard' ? 'bg-amber-900 shadow-inner' : 'hover:bg-amber-900/60'
                                }`}
                                onClick={() => setActiveTab('dashboard')}
                                disabled={loadingUser}
                            >
                                <FaTachometerAlt className="text-xl" /> Dashboard
                            </button>
                            <button
                                className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${
                                    activeTab === 'profile' ? 'bg-amber-900 shadow-inner' : 'hover:bg-amber-900/60'
                                }`}
                                onClick={() => setActiveTab('profile')}
                                disabled={loadingUser}
                            >
                                <FaUserCircle className="text-xl" /> My Profile
                            </button>
                            <button
                                className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${
                                    activeTab === 'orders' ? 'bg-amber-900 shadow-inner' : 'hover:bg-amber-900/60'
                                }`}
                                onClick={() => setActiveTab('orders')}
                                disabled={loadingUser}
                            >
                                <FaClipboardList className="text-xl" /> My Orders
                            </button>
                            <button
                                className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${
                                    activeTab === 'addresses' ? 'bg-amber-900 shadow-inner' : 'hover:bg-amber-900/60'
                                }`}
                                onClick={() => setActiveTab('addresses')}
                                disabled={loadingUser}
                            >
                                <FaMapMarkerAlt className="text-xl" /> Addresses
                            </button>
                            <button
                                className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${
                                    activeTab === 'settings' ? 'bg-amber-900 shadow-inner' : 'hover:bg-amber-900/60'
                                }`}
                                onClick={() => setActiveTab('settings')}
                                disabled={loadingUser}
                            >
                                <FaCog className="text-xl" /> Settings
                            </button>
                        </nav>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg bg-amber-900 hover:bg-amber-700 transition-colors duration-200 mt-8"
                    >
                        <FaSignOutAlt className="text-xl" /> Sign Out
                    </button>
                </div>
                <div className="lg:w-3/4 p-8 md:p-12">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

// NOTE: Please replace the image URLs for the orders with a proper placeholder or static assets if needed.
