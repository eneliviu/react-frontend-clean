import axios from "axios";
//axios.defaults.baseURL = "https://dj-drf-api-763634fa56e5.herokuapp.com";
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;  // Send cookies with requests


/*
Create and export two axios instances to handle requests and responses separately
 They will be imported in CurrentUserContext.js
 */
export const axiosReq = axios.create();
export const axiosRes = axios.create();

