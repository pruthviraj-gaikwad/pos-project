// src/service/paymentService.js
import apiClient from "./api";

export const createRazorpayOrder = async (paymentDetails) => {
    console.log("Payment details: ", paymentDetails);
    return await apiClient.post("/payments/create-order", paymentDetails, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const verifyPayment = async (paymentData) => {
    console.log("Verifying payment: ", paymentData);
    return await apiClient.post("/payments/verify", paymentData);
};
