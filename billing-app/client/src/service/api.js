import axios from 'axios';
import { toast } from 'react-hot-toast';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1.0";

const apiClient = axios.create({
  baseURL: backendUrl,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// You can also add interceptors for responses to handle global errors
let sessionExpiredToastId = null;
let alreadyRedirected = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!toast.isActive(sessionExpiredToastId)) {
        sessionExpiredToastId = toast.error("Your session has expired. Please log in again.");
      }

      // Prevent multiple redirects
      if (!alreadyRedirected) {
        alreadyRedirected = true;
        setTimeout(() => {
          localStorage.removeItem("token"); // optional cleanup
          window.location.href = "/login";
        }, 100); // slight delay
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;