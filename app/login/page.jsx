'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash, FaUser, FaSpinner } from 'react-icons/fa'; // Added FaSpinner

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator

    const router = useRouter();
    const { login } = useAuth(); // <--- Get the login function from AuthContext

    const openModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setModalMessage('');
        setShowModal(false);
        setLoading(true); // <--- Set loading to true

        try {
            const isEmail = identifier.includes('@');

            const payload = {
                password: password,
            };

            if (isEmail) {
                payload.email = identifier;
            } else {
                payload.username = identifier;
            }

            const response = await axios.post('http://localhost:8000/api/login', payload);

            console.log('Login successful:', response.data);

            // --- CRUCIAL CHANGE HERE ---
            // Instead of directly setting localStorage, call the login function from context.
            // This function handles both localStorage and updating the global isLoggedIn state.
            if (response.data.user) {
                login(response.data.user.email, response.data.user.username); // Pass email and username to context login
            } else {
                // Handle case where user data is not directly in response.data.user
                // This might happen if your API returns the user object directly as response.data
                // You'd need to adjust based on your actual API response structure.
                // For example, if response.data is the user object:
                // login(response.data.email, response.data.username);
                openModal('Login successful, but user data structure unexpected.');
                // Still proceed to redirect, but log a warning.
                console.warn('Login response.data.user was null, but login was successful. Check API response structure.');
                login(identifier, identifier); // Fallback: use identifier for both if user data is missing
            }

            router.push('/'); // Redirect after successful login and context update

        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                if (error.response.data && error.response.data.error) {
                    openModal(error.response.data.error);
                } else {
                    openModal('An unexpected error occurred during login.');
                }
            } else if (error.request) {
                openModal('No response from server. Please check your internet connection or try again later.');
            } else {
                openModal('Error setting up the login request. Please try again.');
            }
        } finally {
            setLoading(false); // <--- Set loading to false
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200 p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                <h1 className="text-4xl font-extrabold text-amber-900 mb-6 text-center">Welcome Back!</h1>
                <p className="text-amber-700 text-lg mb-8 text-center">Login to your Leather Walk account</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type="text"
                            id="identifier"
                            placeholder="Email or Username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disable input while loading
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disable input while loading
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors duration-200"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={loading} // Disable button while loading
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-amber-800 text-sm md:text-base">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                                disabled={loading} // Disable checkbox while loading
                            />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <a href="#" className="text-amber-700 hover:underline font-semibold">Forgot Password?</a>
                    </div>

                    {/* Login Button with Loading Indicator */}
                    <button
                        type="submit"
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3 text-xl disabled:opacity-75 disabled:cursor-not-allowed"
                        disabled={loading} // Disable the button when loading
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" /> Logging In...
                            </>
                        ) : (
                            <>
                                <FaSignInAlt /> Login
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-amber-800 mt-8 text-md">
                    Don't have an account?{' '}
                    <a href="#" className="text-amber-700 hover:underline font-semibold flex items-center justify-center gap-1 mt-2">
                        <FaUserPlus className="text-lg" /> Create an Account
                    </a>
                </p>
            </div>

            {/* Modern Error Modal with Blur Background */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    style={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                    <div className="
                        relative bg-white/70 backdrop-filter backdrop-blur-lg
                        rounded-2xl shadow-2xl p-8 w-full max-w-sm
                        transform transition-all duration-300 ease-out
                        scale-100 opacity-100
                        border border-amber-100
                    ">
                        <h2 className="text-3xl font-extrabold text-red-800 mb-5 text-center">Oops!</h2>
                        <p className="text-amber-900 text-center mb-8 text-lg leading-relaxed">
                            {modalMessage}
                        </p>
                        <button
                            onClick={closeModal}
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}