// ### Key Changes:

// 1. **Token Refresh Interval:**
//    - A `setInterval` is used to refresh the token every 54 seconds.
// This assumes a practical refresh strategy intended to trigger before
// the 1-minute expiration period. The interval is cleared on component unmount to prevent memory leaks.

// 2. **Global Logout Handling:**
//    - A `handleLogout` function centralizes the process of clearing tokens
// and navigating to the sign-in page, improving clarity and reuse across actions
// that need to perform logout operations. This function is used in the token refresh
// logic and can be used elsewhere as needed.

// 3. **Use of `useCallback`:**
//    - The `useCallback` hook is used for `clearTokens`, `fetchUserData`, `refreshToken`,
// and `handleLogout` functions to ensure they are not re-created unnecessarily on every render,
// especially helpful when used inside `useEffect`.

// ### Key Changes and Considerations:

// 1. **Immediate User Retrieval:**
//    - On component mount (`useEffect`), attempt to fetch the current user immediately.
// This ensures that when the app loads, it tries to authenticate using any existing tokens.

// 2. **Handle Token and User Initialization:**
//    - Focus on clearly distinguishing between initial token setup and continuous operation.
//  When starting the app, directly attempt user data retrieval (`fetchUserData`) using the stored tokens.

// 3. **Logging and Debugging:**
//    - Add logging throughout the authentication process to help trace where the failure might be.
// Before the `axios.get` call in `fetchUserData`, you can log out the tokens being used to verify
// they are present and valid. Similarly, in the `refreshToken` function, log out the new access token

// ### Proactive Token Refresh (Interval-Based)

// - **Interval Timing:** The code sets up a regular interval (every 30 seconds) to preemptively refresh
// the access token. This strategy helps ensure that the token remains valid during a user's session
// without requiring user actions to trigger re-authentication. The interval is cleared on component
// unmount to prevent unnecessary refreshes when the component is no longer active.

// - **Early Refresh:** By refreshing the token proactively and more frequently than its expiration
// period (e.g., every 30 seconds if the token expires in 1 minute), this approach reduces the likelihood
// of requests failing due to token expiration. It helps maintain a seamless user experience by keeping 
// the token valid without waiting for a request to fail first.

// - **Token Rotation Handling:** If the server issues a new refresh token during these refresh operations
//  (due to rotation settings), the new token is stored in local storage. This ensures that future refresh
//  requests use the latest valid refresh token, which is crucial for maintaining session continuity if
//  tokens are set to rotate upon refresh. The code logs a message when a refresh token rotation occurs.

// ### Reactive Token Refresh (Interceptor-Based)

// - **Interceptor Usage:** The code uses Axios interceptors to handle `401 Unauthorized` responses. 
// If an access token is expired or invalid when a request is made, this reactive mechanism attempts 
// to refresh the token and retry the original request once. This approach provides a safety net for
// unexpected token expiration or errors during API interactions.

// - **Request Retry Logic:** If a 401 error occurs, the interceptor sets a `_retry` flag on the 
// original request to avoid multiple retries for the same request, then attempts to fetch a new access
//  token. If a new token is acquired, the interceptor updates the request's authorization header and 
// reissues the request. This logic helps ensure that the user's request is processed seamlessly after


// - **Fallback on Failure:** If the refresh attempt fails (possibly due to an expired or invalid refresh
//  token), the user is logged out and redirected to the sign-in page. This ensures that users are not 
// left in an irrecoverable state with persistent 401 errors.

// ### Overall Strategy

// - **User Experience:** The combination of proactive and reactive refresh strategies aims to minimize
//  any disruptions to the user's session. Proactive refresh keeps tokens valid under normal use, while 
// the reactive approach provides a backup if the proactive refresh fails or a token expires unexpectedly. 

// - **Efficiency:** While the regular refresh approach potentially increases the number of requests to
//  the server, it ensures high availability of valid tokens and seamless user experience, particularly 
// useful in applications with strict security requirements or short-lived tokens.

// - **Security Considerations:** Regularly refreshing tokens and appropriately handling token rotation
//  help ensure that tokens are not used beyond their valid lifetime, aligning with security best practices
//  for JWT management. The use of interceptors to handle token expiration provides a safety net against


// This implementation effectively balances user experience with security needs, ensuring tokens are 
// regularly updated to be valid while also providing reactive handling of any authorization errors
//  encountered during API interactions. The centralized logout handling and token refresh logic 
//  contribute to a more robust and maintainable authentication system. The logging and error handling
//  mechanisms help in diagnosing and resolving issues related to token management and user authentication

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";


// Create the context for the current user and the function to update it.
export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

// Custom hooks to access the current user context and the function to update it.
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// This component provides the current user context to its children.
// It also handles token refresh, user data fetching, and logout functionality.
const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const clearTokens = useCallback(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }, []);

    const handleLogout = useCallback(() => {
        clearTokens();
        setCurrentUser(null);
        navigate("/");
    }, [clearTokens, navigate]);

    const fetchUserData = useCallback(async () => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            try {
                const { data } = await axiosReq.get("/dj-rest-auth/user/", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setCurrentUser(data);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                // Do not perform handleLogout here immediately
                // Adjust to have a separate handling logic for 401
            }
        } else {
            navigate("/signin");
        }
    }, [navigate]);

    const refreshToken = useCallback(async () => {
        const refreshTokenValue = localStorage.getItem("refresh_token");
        if (!refreshTokenValue) {
            console.warn("No refresh token available, redirecting to sign-in.");
            navigate("/signin");
            return;
        }

        try {
            console.log(
                "Attempting to refresh token with refresh token:",
                refreshTokenValue
            );
            const response = await axios.post("/api-auth/token/refresh/", {
                refresh: refreshTokenValue,
            });

            const { access, refresh: newRefresh } = response.data;
            localStorage.setItem("access_token", access);

            if (newRefresh) {
                // Store the new refresh token if one is provided
                localStorage.setItem("refresh_token", newRefresh);
                console.log("Refresh token has been rotated.");
            }

            console.log("Access token refreshed successfully");
            return access; // Return to allow potential usage in retry logic
        } catch (err) {
            if (err.response) {
                console.error("Token refresh failed:", err.response.data);
            } else if (err.request) {
                console.error(
                    "Token refresh failed: No response received",
                    err.request
                );
            } else {
                console.error("Token refresh failed:", err.message);
            }
            handleLogout();
        }
    }, [navigate, handleLogout]); // navigate, handleLogout

    useEffect(() => {
        // Fetch user data on application load
        fetchUserData();
    }, [fetchUserData]); // 

    useEffect(() => {
        // Check if there's a refresh token before setting up the interval
        const refreshTokenValue = localStorage.getItem("refresh_token");
        if (!refreshTokenValue) {
            console.warn(
                "No refresh token available at app startup, skipping refresh interval setup."
            );
            return; // Exit early if no token is available
        }

        // Set the refresh interval if refresh token is present
        const intervalId = setInterval(async () => {
            console.log("Attempting to refresh token...");
            await refreshToken();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [refreshToken]);

    useEffect(() => {
        // The request interceptor adds the access token to the headers of every outgoing request.
        const requestInterceptor = axiosReq.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem("access_token");
                if (accessToken) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // The response interceptor handles 401 Unauthorized responses by
        // attempting to refresh the access token and retry the original request.
        const responseInterceptor = axiosRes.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newAccessToken = await refreshToken();

                    if (newAccessToken) {
                        originalRequest.headers[
                            "Authorization"
                        ] = `Bearer ${newAccessToken}`;
                        return axiosRes(originalRequest);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosReq.interceptors.request.eject(requestInterceptor);
            axiosRes.interceptors.response.eject(responseInterceptor);
        };
    }, [refreshToken]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};

export default CurrentUserProvider;


// import React, {
//     createContext,
//     useContext,
//     useState,
//     useEffect,
//     useCallback,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { axiosReq, axiosRes } from "../api/axiosDefaults";

// export const CurrentUserContext = createContext(null);
// export const SetCurrentUserContext = createContext(null);

// export const useCurrentUser = () => useContext(CurrentUserContext);
// export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// const CurrentUserProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const navigate = useNavigate();

//     const clearTokens = useCallback(() => {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//     }, []);

//     const handleLogout = useCallback(() => {
//         clearTokens();
//         setCurrentUser(null);
//         navigate("/signin");
//     }, [clearTokens, navigate]);

//     const fetchUserData = useCallback(async () => {
//         const accessToken = localStorage.getItem("access_token");
//         if (accessToken) {
//             try {
//                 const { data } = await axiosReq.get("/dj-rest-auth/user/");
//                 setCurrentUser(data);
//             } catch (err) {
//                 console.error("Failed to fetch user data:", err);
//                 handleLogout();
//             }
//         } else {
//             navigate("/signin");
//         }
//     }, [navigate, handleLogout]);

//     const refreshToken = useCallback(async () => {
//         const refreshTokenValue = localStorage.getItem("refresh_token");
//         if (!refreshTokenValue) {
//             console.warn("No refresh token available, redirecting to sign-in.");
//             handleLogout();
//             return;
//         }

//         try {
//             console.log(
//                 "Attempting to refresh token with refresh token:",
//                 refreshTokenValue
//             );
//             const { data } = await axios.post("/api-auth/token/refresh/", {
//                 refresh: refreshTokenValue,
//             });
//             const { access, refresh: newRefresh } = data;
//             localStorage.setItem("access_token", access);

//             if (newRefresh) {
//                 localStorage.setItem("refresh_token", newRefresh);
//                 console.log("Refresh token has been rotated.");
//             }

//             console.log("Access token refreshed successfully");
//             return access;
//         } catch (err) {
//             console.error(
//                 "Token refresh failed:",
//                 err.response?.data || err.message
//             );
//             handleLogout();
//         }
//     }, [handleLogout]);

//     useEffect(() => {
//         fetchUserData();
//     }, [fetchUserData]);

//     useEffect(() => {
//         const refreshTokenValue = localStorage.getItem("refresh_token");
//         if (!refreshTokenValue) {
//             console.warn(
//                 "No refresh token available at app startup, skipping refresh interval setup."
//             );
//             return;
//         }

//         const intervalId = setInterval(async () => {
//             console.log("Attempting to refresh token...");
//             await refreshToken();
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [refreshToken]);

//     useEffect(() => {
//         const addAuthHeader = (config) => {
//             const accessToken = localStorage.getItem("access_token");
//             if (accessToken) {
//                 config.headers["Authorization"] = `Bearer ${accessToken}`;
//             }
//             return config;
//         };

//         const handleResponseError = async (error) => {
//             const originalRequest = error.config;

//             if (error.response?.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;
//                 const newAccessToken = await refreshToken();

//                 if (newAccessToken) {
//                     originalRequest.headers[
//                         "Authorization"
//                     ] = `Bearer ${newAccessToken}`;
//                     return axiosRes(originalRequest);
//                 }
//             }
//             return Promise.reject(error);
//         };

//         const requestInterceptor = axiosReq.interceptors.request.use(
//             addAuthHeader,
//             (error) => Promise.reject(error)
//         );
//         const responseInterceptor = axiosRes.interceptors.response.use(
//             (response) => response,
//             handleResponseError
//         );

//         return () => {
//             axiosReq.interceptors.request.eject(requestInterceptor);
//             axiosRes.interceptors.response.eject(responseInterceptor);
//         };
//     }, [refreshToken]);

//     return (
//         <CurrentUserContext.Provider value={currentUser}>
//             <SetCurrentUserContext.Provider
//                 value={{ setCurrentUser, handleLogout }} // ,handleLogout
//             >
//                 {children}
//             </SetCurrentUserContext.Provider>
//         </CurrentUserContext.Provider>
//     );
// };

// export default CurrentUserProvider;