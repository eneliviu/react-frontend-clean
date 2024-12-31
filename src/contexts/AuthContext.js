import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    login as authLogin,
    refreshToken,
    getCurrentUser,
    logout as authLogout,
} from "../services/authService";

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // To handle initial loading state

    // Initialize authentication state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("access_token");
            const refreshTokenValue = localStorage.getItem("refresh_token");

            if (accessToken || refreshTokenValue) {
                try {
                    await refreshToken(); // Refresh token if possible
                    const user = await getCurrentUser();
                    setCurrentUser(user);
                } catch (error) {
                    console.error(
                        "Authentication initialization failed:",
                        error
                    );
                    handleLogout();
                }
            }
            setLoading(false); // Finished initializing
        };

        initializeAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs once

    // Handle user login
    const handleLogin = async (username, password) => {
        try {
            await authLogin(username, password);
            const user = await getCurrentUser();
            setCurrentUser(user);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            // Optionally, handle login errors here (e.g., show a message)
        }
    };

    // Handle user logout
    const handleLogout = () => {
        authLogout();
        setCurrentUser(null);
        navigate("/signin");
    };

    // Handle token refresh
    const handleRefreshToken = async () => {
        try {
            await refreshToken();
            const user = await getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error("Token refresh failed:", error);
            handleLogout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                handleLogin,
                handleLogout,
                handleRefreshToken,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
