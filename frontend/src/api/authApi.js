import api from './axios';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await api.post('/auth/delete', { password });
  return response.data;
};

export const checkEmail = async (email) => {
  const response = await api.post('/auth/check-email', { email });
  return response.data;
};
