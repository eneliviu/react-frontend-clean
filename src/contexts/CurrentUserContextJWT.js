import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axiosRes, axiosReq } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// The CurrentUserProvider component is used to wrap the entire app in the CurrentUserContext.Provider
export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useNavigate();

    const handleMount = async (setCurrentUser, history) => {
        let access = null;

        if (localStorage.getItem("refresh_token")) {
            const token = localStorage.getItem("refresh_token");
            try {
                const { data } = await axios.post("/api-auth/token/refresh/",
                    {
                        refresh: token,
                    }
                );
                access = data.access;
                const refresh = data.refresh;

                // Store both tokens in localStorage
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);

                // Set the Authorization header
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${access}`;
            } catch (err) {
                console.error("Token refresh failed:", err);
                setCurrentUser(null);
                history("/signin");
                return;
            }
        }

        try {
            const { data } = await axios.get("/dj-rest-auth/user/");
            if (data) {
                setCurrentUser(data);
            } else {
                setCurrentUser(null);
                history("/signin");
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setCurrentUser(null);
        }
    };

    // Call the handleMount function only once when the component mounts
    useEffect(() => {
        handleMount(setCurrentUser, history);
    }, [history]);

    useMemo(() => {
        const requestInterceptor = axiosReq.interceptors.request.use(
            async (config) => {
                try {
                    const refreshResponse = await axios.post(
                        "/api-auth/token/refresh/"
                    );
                    const { access } = refreshResponse.data;
                    localStorage.setItem("access_token", access);
                    axiosReq.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${access}`;
                    config.headers["Authorization"] = `Bearer ${access}`;
                } catch (err) {
                    setCurrentUser((prevCurrentUser) => {
                        if (prevCurrentUser) {
                            history("/signin");
                        }
                        return null;
                    });
                    return config;
                }
                return config;
            },
            (err) => {
                return Promise.reject(err);
            }
        );

        const responseInterceptor = axiosRes.interceptors.response.use(
            (response) => response,
            async (err) => {
                if (err.response?.status === 401) {
                    try {
                        const refreshResponse = await axios.post(
                            "/api-auth/token/refresh/"
                        );
                        const { access } = refreshResponse.data;
                        localStorage.setItem("access_token", access);
                        axiosRes.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${access}`;
                        err.config.headers[
                            "Authorization"
                        ] = `Bearer ${access}`;
                        return axiosRes(err.config);
                    } catch (err) {
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                history("/signin");
                            }
                            return null;
                        });
                    }
                    return axios(err.config);
                }
                return Promise.reject(err);
            }
        );
    }, [history]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
