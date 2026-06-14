import api from './axios';

export const viewResume = async () => {
  const response = await api.get('/resume/view');
  return response.data;
};

export const uploadResume = async (formData) => {
  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const saveResume = async (resumeData) => {
  const response = await api.post('/resume/save', resumeData);
  return response.data;
};

export const deleteResume = async () => {
  const response = await api.delete('/resume/delete');
  return response.data;
};
