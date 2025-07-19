// context/AuthContext.js
'use client'; // This is a client component

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Context object
export const AuthContext = createContext(null);

// Create the Provider component that will wrap your application
export const AuthProvider = ({ children }) => {
    // isLoggedIn defaults to false. This is the value used during server rendering.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // user will now store the full user object from the backend: { _id, email, username, ... }
    const [user, setUser] = useState(null);
    // isAuthReady tracks if the client-side useEffect has run and checked localStorage.
    const [isAuthReady, setIsAuthReady] = useState(false);

    // useEffect runs only on the client-side after the initial render (hydration).
    useEffect(() => {
        const storedUser = localStorage.getItem('user'); // Changed from 'userEmail'
        const storedToken = localStorage.getItem('token'); // Assuming your backend provides a token (e.g., JWT)

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // Set the full user object here
                setIsLoggedIn(true);
                // Optional: If you use Axios or a similar library globally for authenticated requests,
                // you might set a default authorization header here.
                // Example with Axios (ensure axios is imported/available globally if used this way):
                // if (typeof window !== 'undefined' && window.axios) {
                //     window.axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                // }
            } catch (e) {
                console.error("Failed to parse stored user data or token:", e);
                // Clear invalid data if parsing fails
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
                setIsLoggedIn(false);
            }
        } else {
            // If no user or token is found, ensure states are reset
            setIsLoggedIn(false);
            setUser(null);
        }
        // Once localStorage has been checked, set isAuthReady to true.
        setIsAuthReady(true);
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to handle login: updates state and localStorage
    // Now accepts the full userData object (from backend) and a token
    const login = (userData, token) => {
        // userData should typically be an object like { _id: '...', email: '...', username: '...' }
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token); // Store the token
        setUser(userData); // Set the full user object
        setIsLoggedIn(true);
        // Optional: Set global authorization header
        // if (typeof window !== 'undefined' && window.axios) {
        //     window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // }
    };

    // Function to handle logout: updates state and clears localStorage
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Optional: Clear global authorization header
        // if (typeof window !== 'undefined' && window.axios) {
        //     delete window.axios.defaults.headers.common['Authorization'];
        // }
        setIsLoggedIn(false);
        setUser(null); // Clear the user object
    };

    // The value provided to consumers of this context
    const contextValue = {
        isLoggedIn,
        user, // Now exposing the full user object (which will contain _id)
        login,
        logout,
        isAuthReady // Expose isAuthReady so components can wait for hydration
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {/* Optionally, you can show a loading spinner until isAuthReady is true */}
            {isAuthReady ? children : <div className="flex items-center justify-center min-h-screen text-amber-700">Loading authentication...</div>}
        </AuthContext.Provider>
    );
};

// Custom hook for easier consumption of the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // This error helps ensure useAuth is only called within an AuthProvider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};