// src/service/emailOtpService.js
import apiClient from "./api"; // ✅ Import the new api client

export const sendOtpToMailService = async (email) => {
  // ✅ Use the apiClient instance
  return await apiClient.post(`/email/otp/send`, { email: email });
};

export const verifyOtpToMailService = async (email, otp) => {
  // ✅ Use the apiClient instance
  return await apiClient.post(`/email/otp/verify`, { email: email, otp: otp });
};