import axios from "axios";
import { shouldRefreshToken } from "../utils/utils";
// axios.defaults.baseURL = "https://dj-drf-api-763634fa56e5.herokuapp.com";
axios.defaults.baseURL = "http://127.0.0.1:8000";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true; // Send cookies with requests

/*
Create and export two axios instances to handle requests and responses separately
 They will be imported in CurrentUserContext.js
 */
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Set up the request interceptor to include the token in the headers for axiosRes
axiosReq.interceptors.request.use(
    async (config) => {
        // if (shouldRefreshToken()){
        // }
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Set up the response interceptor to handle token refresh for axiosRes
axiosRes.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        "/api-auth/token/refresh/",
                        { refresh: refreshToken }
                    );
                    localStorage.setItem("access_token", data.access);
                    // localStorage.setItem("refresh_token", data.refresh);

                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${data.access}`;
                    return axiosRes(originalRequest);
                } catch (err) {
                    console.error("Token refresh failed:", err);
                    // Handle logout or redirect to login page if needed
                }
            }
        }

        return Promise.reject(error);
    }
);
