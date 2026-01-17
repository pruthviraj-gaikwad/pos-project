import apiClient from './api';

export const loginService = async (loginData) => {
  const response = await apiClient.post(`/login`, loginData);
  return response;
};

export const addUser = async (userDetails) => {
    console.log(userDetails);
  return await apiClient.post('/admin/add-user', userDetails);
};