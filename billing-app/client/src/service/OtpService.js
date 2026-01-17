// src/service/OtpService.js
import apiClient from "./api"; // ✅ Import the new api client

export const optService = async (phone) => {
  // ✅ Use the apiClient instance
  return await apiClient.post(`/otp/send`, {
    phoneNumber: "+91" + phone
  });
};

export const verifyOtp = async (phone, otp) => {
  // ✅ Use the apiClient instance
  return await apiClient.post(`/otp/verify`, {
    phoneNumber: "+91" + phone,
    otp: otp
  });
};