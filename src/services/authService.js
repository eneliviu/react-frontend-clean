import axios from "axios";

// Axios request interceptor to set the Authorization header dynamically
// axios.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("access_token");
//         if (token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// Function to handle user login
export const login = async (username, password) => {
    const response = await axios.post("/api-auth/token/", {
        username,
        password,
    }); // Send a POST request to the login endpoint with username and password
    const { access, refresh } = response.data; // Destructure access and refresh tokens from the response
    localStorage.setItem("access_token", access); // Store the access token in localStorage
    localStorage.setItem("refresh_token", refresh); // Store the refresh token in localStorage
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`; // Set the Authorization header for future requests
    return response.data; // Return the response data
};

// Function to handle token refresh
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token"); // Get the refresh token from localStorage

    if (!refreshToken) {
        throw new Error("No refresh token found."); // Throw an error if no refresh token is found
    }

    try {
        const response = await axios.post(
            "/api-auth/token/refresh/",
            { refresh: refreshToken }, // Send the refresh token in the request body
        ); // Send a POST request to the token refresh endpoint

        const newAccessToken = response.data.access; // Get the new access token from the response
        localStorage.setItem("access_token", newAccessToken); // Store the new access token in localStorage
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${newAccessToken}`; // Update the Authorization header with the new access token
        return newAccessToken; // Return the new access token
    } catch (error) {
        console.error("Token refresh failed:", error);
        if (error.response) {
            console.error("Error data:", error.response.data); // Log the server's error response
            console.error("Error status:", error.response.status);
        }
        throw error; // Re-throw the error to be handled by the calling function
    }
};

// Function to get the current user
export const getCurrentUser = async () => {
    try {
        const response = await axios.get("/dj-rest-auth/user/"); // Send a GET request to the user endpoint
        return response.data; // Return the user data from the response
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // If the error is a 401 Unauthorized, try refreshing the token
            try {
                await refreshToken(); // Refresh the token
                const response = await axios.get("/dj-rest-auth/user/"); // Retry the request
                return response.data; // Return the user data from the response
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError; // Re-throw the error to be handled by the calling function
            }
        } else {
            console.error("Failed to fetch current user:", error);
            throw error; // Re-throw the error to be handled by the calling function
        }
    }
};

// Function to handle user logout
export const logout = () => {
    localStorage.removeItem("access_token"); // Remove the access token from localStorage
    localStorage.removeItem("refresh_token"); // Remove the refresh token from localStorage
    delete axios.defaults.headers.common["Authorization"]; // Remove the Authorization header
};
