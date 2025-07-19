'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaMapMarkerAlt, FaEye, FaEyeSlash, FaUserPlus, FaSignInAlt, FaSpinner } from 'react-icons/fa'; // Added FaSpinner for the loading indicator

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [county, setCounty] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for the loading indicator

    const router = useRouter();
    const { login } = useAuth(); // Get the login function from AuthContext

    // List of Kenyan Counties
    const kenyanCounties = [
        "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
        "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
        "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
        "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
        "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
        "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
        "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
    ];

    const handleRegister = async (e) => {
        e.preventDefault();

        // Clear previous messages and errors
        setPasswordError('');
        setApiError('');
        setSuccessMessage('');
        setLoading(true); // Start loading process

        // Client-side password validation
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            setLoading(false); // Stop loading on validation error
            return;
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            setLoading(false); // Stop loading on validation error
            return;
        }

        try {
            // 1. Register the user
            const registerResponse = await axios.post('http://localhost:8000/api/users', {
                username,
                fullname: fullName,
                phone,
                email,
                county,
                password,
            });

            console.log('Registration successful:', registerResponse.data);
            setSuccessMessage('Registration successful! Attempting to log in...');

            // 2. Automatically log in the user using the email and password
            const loginResponse = await axios.post('http://localhost:8000/api/login', {
                email, // Use email for login
                password,
            });

            console.log('Login successful:', loginResponse.data);
            setSuccessMessage('Account created and logged in successfully!');

            // 3. Update the AuthContext with the logged-in user's details
            if (loginResponse.data.user) {
                login(loginResponse.data.user.email, loginResponse.data.user.username);
            } else {
                // Fallback: If user data isn't directly under .user, use the form's email/username
                console.warn('Login response.data.user was null, but login was successful. Using form data for context.');
                login(email, username);
            }

            // 4. Redirect to the home page after successful login and context update
            router.push('/');

        } catch (error) {
            console.error('Operation error:', error); // Consolidated error logging

            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                if (error.response.data && error.response.data.error) {
                    setApiError(error.response.data.error);
                } else if (error.response.status === 401) {
                    setApiError('Login failed after registration. Please try logging in manually.');
                } else {
                    setApiError('An unexpected error occurred during signup or auto-login. Please try again.');
                }
            } else if (error.request) {
                // Request was made but no response received (e.g., network error)
                setApiError('No response from server. Please check your internet connection or try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setApiError('Error setting up the request. Please ensure all fields are correctly filled.');
            }
        } finally {
            setLoading(false); // Stop loading process regardless of success or failure
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200 p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                <h1 className="text-4xl font-extrabold text-amber-900 mb-6 text-center">Create Account</h1>
                <p className="text-amber-700 text-lg mb-8 text-center">Join Leather Walk today!</p>

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Username Input */}
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disabled while loading
                        />
                    </div>
                    {/* Full Name Input */}
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disabled while loading
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="relative">
                        <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Phone Number (e.g., 0712345678)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            required
                            disabled={loading} // Disabled while loading
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type="email"
                            id="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disabled while loading
                        />
                    </div>

                    {/* County Select */}
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl pointer-events-none" />
                        <select
                            id="county"
                            value={county}
                            onChange={(e) => setCounty(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 bg-white appearance-none transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disabled while loading
                        >
                            <option value="" disabled>Select your County</option>
                            {kenyanCounties.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    {/* Password Input */}
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
                            disabled={loading} // Disabled while loading
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors duration-200"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={loading} // Disabled while loading
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                            required
                            disabled={loading} // Disabled while loading
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors duration-200"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            disabled={loading} // Disabled while loading
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Error and Success Messages */}
                    {passwordError && (
                        <p className="text-red-600 text-sm mt-2 text-center">{passwordError}</p>
                    )}
                    {apiError && (
                        <p className="text-red-600 text-sm mt-2 text-center">{apiError}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-600 text-sm mt-2 text-center">{successMessage}</p>
                    )}

                    {/* Register Button with Loading Indicator */}
                    <button
                        type="submit"
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3 text-xl disabled:opacity-75 disabled:cursor-not-allowed"
                        disabled={loading} // Disable the button when loading
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" /> Registering...
                            </>
                        ) : (
                            <>
                                <FaUserPlus /> Register
                            </>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-amber-800 mt-8 text-md">
                    Already have an account?{' '}
                    <a href="#" className="text-amber-700 hover:underline font-semibold flex items-center justify-center gap-1 mt-2">
                        <FaSignInAlt className="text-lg" /> Login Here
                    </a>
                </p>
            </div>
        </div>
    );
}