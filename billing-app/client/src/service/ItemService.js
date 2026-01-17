import axios from "axios";
import apiClient from './api.js';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1.0";
// const token = localStorage.getItem("token"); // ✅ moved inside

export const allItems = async () => {
  return await apiClient.get(`${backendUrl}/items/all-items`);
};

export const addItem = async (itemDetails, file) => {
  // const token = localStorage.getItem("token"); // ✅ moved inside
  const formData = new FormData();
  formData.append("item", JSON.stringify(itemDetails));
  formData.append("file", file);
  return await apiClient.post(`${backendUrl}/items/add-item`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItem = async (itemId) => {
  const token = localStorage.getItem("token"); // ✅ moved inside
  return await axios.delete(`${backendUrl}/items/delete-item/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
