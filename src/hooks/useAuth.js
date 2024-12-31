import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    login,
    refreshToken,
    getCurrentUser,
    logout,
} from "../services/authService";

// Custom hook to manage authentication
export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const navigate = useNavigate(); // Hook to programmatically navigate

    // Effect to fetch the current user when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                await refreshToken(); // Refresh the token before fetching the user
                const user = await getCurrentUser(); // Fetch the current user from the API
                setCurrentUser(user); // Set the current user in state
            } catch (error) {
                console.error("Failed to fetch user:", error);
                navigate("/signin"); // Navigate to the sign-in page if fetching the user fails
            }
        };

        fetchUser(); // Call the fetchUser function
    }, [navigate]); // Dependency array to run the effect only once when the component mounts

    // Function to handle user login
    const handleLogin = async (username, password) => {
        try {
            await login(username, password); // Call the login function from the auth service
            const user = await getCurrentUser(); // Fetch the current user after successful login
            setCurrentUser(user); // Set the current user in state
            navigate("/"); // Navigate to the home page after successful login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // Function to handle user logout
    const handleLogout = () => {
        logout(); // Call the logout function from the auth service
        setCurrentUser(null); // Clear the current user from state
        navigate("/signin"); // Navigate to the sign-in page after logout
    };

    // Function to handle token refresh
    const handleRefreshToken = async () => {
        try {
            await refreshToken(); // Call the refreshToken function from the auth service
            const user = await getCurrentUser(); // Fetch the current user after refreshing the token
            setCurrentUser(user); // Set the current user in state
        } catch (error) {
            console.error("Token refresh failed:", error);
            handleLogout(); // Logout the user if token refresh fails
        }
    };

    // Return the current user and authentication functions
    return {
        currentUser,
        handleLogin,
        handleLogout,
        handleRefreshToken,
    };
};
