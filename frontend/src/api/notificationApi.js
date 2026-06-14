import api from './axios';

export const getAllNotifications = async () => {
  const response = await api.get('/notification');
  return response.data;
};

export const getNotificationById = async (id) => {
  const response = await api.get(`/notification/${id}`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notification/mark-all-read');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notification/${id}/read`);
  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await api.delete('/notification/delete-all');
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notification/${id}`);
  return response.data;
};
