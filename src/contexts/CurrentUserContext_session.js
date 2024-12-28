import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosRes, axiosReq } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Function to detect authentication type
// const detectAuthType = () => {
//     if (localStorage.getItem("refresh_token")) {
//         return "JWT";
//     }
//     return "SESSION";
// };
// console.log("authType", detectAuthType());

// The CurrentUserProvider component is used to wrap the entire app in the CurrentUserContext.Provider
export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    // const authType = detectAuthType();
    const authType = "JWT";

    // Function to handle component mount
    const handleMount = async () => {
        if (authType === "JWT") {
            let access = null;

            if (localStorage.getItem("refresh_token")) {
                const token = localStorage.getItem("refresh_token");
                try {
                    const { data } = await axios.post(
                        "/api-auth/token/refresh/",
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
                    navigate("/signin");
                    return;
                }
            }
        }

        try {
            const { data } = await axios.get("/api-auth/login/");
            setCurrentUser(data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setCurrentUser(null);
        }
    };

    // Call the handleMount function only once when the component mounts
    useEffect(() => {
        handleMount();
    }, []);

    // Set the Authorization header whenever the access token changes (for JWT)
    useEffect(() => {
       
        if (authType === "JWT") {
            const token = localStorage.getItem("access_token");
            if (token) {
                axiosReq.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
                axiosRes.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
            } else {
                delete axiosReq.defaults.headers.common["Authorization"];
                delete axiosRes.defaults.headers.common["Authorization"];
            }
        }
    }, [currentUser, authType]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};


// import { createContext, useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { axiosRes, axiosReq } from "../api/axiosDefaults";

// export const CurrentUserContext = createContext(null);
// export const SetCurrentUserContext = createContext(null);

// export const useCurrentUser = () => useContext(CurrentUserContext);
// export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// // Function to detect authentication type
// const detectAuthType = () => {
//     if (localStorage.getItem("refresh_token")) {
//         return "JWT";
//     }
//     return "SESSION";
// };
// console.log("authType", detectAuthType());

// // Function to handle component mount
// const handleMount = async (setCurrentUser, navigate, authType) => {
//     if (authType === "JWT") {
//         let access = null;

//         if (localStorage.getItem("refresh_token")) {
//             const token = localStorage.getItem("refresh_token");
//             try {
//                 const { data } = await axios.post("/api-auth/token/refresh/", {
//                     refresh: token,
//                 });
//                 access = data.access;
//                 const refresh = data.refresh;

//                 // Store both tokens in localStorage
//                 localStorage.setItem("access_token", access);
//                 localStorage.setItem("refresh_token", refresh);

//                 // Set the Authorization header
//                 axios.defaults.headers.common[
//                     "Authorization"
//                 ] = `Bearer ${access}`;
//             } catch (err) {
//                 console.error("Token refresh failed:", err);
//                 setCurrentUser(null);
//                 navigate("/signin");
//                 return;
//             }
//         }
//     }

//     try {
//         const { data } = await axios.get("/dj-rest-auth/user/");
//         setCurrentUser(data);
//     } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setCurrentUser(null);
//     }
// };

// // The CurrentUserProvider component is used to wrap the entire app in the CurrentUserContext.Provider
// export const CurrentUserProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const navigate = useNavigate();
//     const authType = detectAuthType();

//     // Call the handleMount function only once when the component mounts
//     useEffect(() => {
//         handleMount(setCurrentUser, navigate, authType);
//     }, [navigate, authType]);

//     // Set the Authorization header whenever the access token changes (for JWT)
//     useEffect(() => {
//         if (authType === "JWT") {
//             const token = localStorage.getItem("access_token");
//             if (token) {
//                 axiosReq.defaults.headers.common[
//                     "Authorization"
//                 ] = `Bearer ${token}`;
//                 axiosRes.defaults.headers.common[
//                     "Authorization"
//                 ] = `Bearer ${token}`;
//             } else {
//                 delete axiosReq.defaults.headers.common["Authorization"];
//                 delete axiosRes.defaults.headers.common["Authorization"];
//             }
//         }
//     }, [currentUser, authType]);

//     return (
//         <CurrentUserContext.Provider value={currentUser}>
//             <SetCurrentUserContext.Provider value={setCurrentUser}>
//                 {children}
//             </SetCurrentUserContext.Provider>
//         </CurrentUserContext.Provider>
//     );
// };