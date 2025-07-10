'use client';
import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real application, you would send these credentials to your authentication API
    console.log('Login attempt:', { email, password, rememberMe });
    alert('Login functionality is not implemented in this demo. Check console for details.');
    // Redirect on successful login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-amber-900 mb-6 text-center">Welcome Back!</h1>
        <p className="text-amber-700 text-lg mb-8 text-center">Login to your Leather Walk account</p>

        <form onSubmit={handleLogin} className="space-y-6">
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
            />
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-amber-800 text-sm md:text-base">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox h-5 w-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-amber-700 hover:underline font-semibold">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3 text-xl"
          >
            <FaSignInAlt /> Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-amber-800 mt-8 text-md">
          Don't have an account?{' '}
          <a href="#" className="text-amber-700 hover:underline font-semibold flex items-center justify-center gap-1 mt-2">
            <FaUserPlus className="text-lg" /> Create an Account
          </a>
        </p>
      </div>
    </div>
  );
}
