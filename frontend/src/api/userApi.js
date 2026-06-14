import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const getAllProfiles = async () => {
  const response = await api.get('/user/users');
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get(`/user/search/${query}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

export const getCodingStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}`);
  return response.data;
};

export const toggleBlockUser = async (userId) => {
  const response = await api.put(`/user/toggle-block/${userId}`);
  return response.data;
};
