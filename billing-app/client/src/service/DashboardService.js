import apiClient from './api.js'
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1.0";
const token = localStorage.getItem("token")
export const fetchDashboard =async () =>{
   return await apiClient.get(`${backendUrl}/dashboard`);
}