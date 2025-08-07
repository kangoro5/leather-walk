'use client';

import React, { useState } from 'react';

export default function AdminLogin() {
    // 1. Use state to manage the form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form refresh behavior

        // Reset any previous errors and set loading state
        setError('');
        setLoading(true);

        const loginUrl = 'http://localhost:8000/api/admin/login'; // Your API endpoint
        
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: email, password }),
            });

            // Handle the response
            if (response.ok) {
                // Login was successful
                const data = await response.json();
                console.log('Login successful:', data);
                // In a real app, you would redirect the user to the admin dashboard
                // For now, we'll just show a success message
                alert('Login successful! You can now proceed.');
            } else {
                // Login failed, get the error message from the server
                const errorData = await response.json();
                setError(errorData.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            // Handle network errors (e.g., server is down)
            console.error('Login failed:', err);
            setError('Could not connect to the server. Please try again later.');
        } finally {
            // Stop the loading state regardless of the outcome
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

                {/* 3. Attach the handleSubmit function to the form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            // 4. Connect the input to the state
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            // 4. Connect the input to the state
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 5. Display the error message if it exists */}
                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full text-amber-600 hover:text-amber-800  py-2 rounded-md hover:bg-amber-800 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {/* 6. Show a loading message when the request is in progress */}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
