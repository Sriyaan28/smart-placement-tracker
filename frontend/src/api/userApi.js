import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const getAllProfiles = async () => {
  const response = await api.get('/user/profiles');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/user/profile', userData);
  return response.data;
};

export const getCodingStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get(`/user/search/${query}`);
  return response.data;
};

export const toggleBlockUser = async (userId) => {
  const response = await api.put(`/user/toggle-block/${userId}`);
  return response.data;
};
