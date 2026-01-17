// src/service/orderService.js
import apiClient from "./api";

export const createOrder = async (orderDetails) => {
    return await apiClient.post("/orders", orderDetails);
};

export const allOrders = async () => {
    return await apiClient.get("/orders");
};

export const deleteOrder = async (orderId) => {
    return await apiClient.delete(`/orders/${orderId}`);
};
