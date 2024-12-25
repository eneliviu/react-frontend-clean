import axios from "axios";

//axios.defaults.baseURL = "https://dj-drf-api-763634fa56e5.herokuapp.com";
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;
//axios.defaults.xsrfCookieName = "csrftoken";

