import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";
// import axios from "axios";

export const useRedirect = (userAuthStatus) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMount = async () => {
            try {
                await axiosReq.get("/dj-rest-auth/user/");
                // if user is logged in, the code below will run
                if (userAuthStatus === "loggedIn") {
                    navigate("/");
                }
            } catch (err) {
                if (userAuthStatus === "loggedOut") {
                    navigate("/");
                }
            }
        };
        handleMount();
    }, [navigate, userAuthStatus]);
};
