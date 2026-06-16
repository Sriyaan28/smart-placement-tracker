import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const getCompanyPublicProfile = async (companyId) => {
  const response = await api.get(`/user/company/${companyId}`);
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

export const getBasicStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}/basic`);
  return response.data;
};

export const getResumeStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}/resume`);
  return response.data;
};

export const getLeetcodeStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}/leetcode`);
  return response.data;
};

export const getGithubStats = async (userId) => {
  const response = await api.get(`/user/stats/${userId}/github`);
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
