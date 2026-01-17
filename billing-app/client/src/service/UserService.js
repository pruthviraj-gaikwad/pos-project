// src/service/userService.js
import apiClient from './api'; // use your configured axios instance

export const addUser = async (userDetails) => {
  return await apiClient.post('/admin/add-user', userDetails);
};

export const allUsers = async () => {
  return await apiClient.get('/admin/get-all-users');
};

export const deleteUser = async (userId) => {
  return await apiClient.delete(`/admin/delete-user/${userId}`);
};
