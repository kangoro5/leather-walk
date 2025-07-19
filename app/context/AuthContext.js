// context/AuthContext.js
'use client'; // This is a client component

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Context object
export const AuthContext = createContext(null);

// Create the Provider component that will wrap your application
export const AuthProvider = ({ children }) => {
    // isLoggedIn defaults to false. This is the value used during server rendering.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    // isAuthReady tracks if the client-side useEffect has run and checked localStorage.
    const [isAuthReady, setIsAuthReady] = useState(false);

    // useEffect runs only on the client-side after the initial render (hydration).
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setIsLoggedIn(true);
            setUserEmail(storedEmail);
        } else {
            setIsLoggedIn(false);
            setUserEmail(null);
        }
        // Once localStorage has been checked, set isAuthReady to true.
        setIsAuthReady(true);
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to handle login: updates state and localStorage
    const login = (email, username) => {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', username); // Store username for display
        setIsLoggedIn(true);
        setUserEmail(email);
    };

    // Function to handle logout: updates state and clears localStorage
    const logout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        // If you were storing a token, clear it here too:
        // localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setUserEmail(null);
    };

    // The value provided to consumers of this context
    const contextValue = {
        isLoggedIn,
        userEmail,
        login,
        logout,
        isAuthReady // Expose isAuthReady so components can wait for hydration
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
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