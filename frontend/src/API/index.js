import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // Replace with your server URL
});

export default api;
