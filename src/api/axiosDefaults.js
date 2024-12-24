import axios from "axios";

axios.defaults.baseURL = "https://dj-drf-api-763634fa56e5.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.withCredentials = true;


