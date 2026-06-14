import api from './axios';

export const createJob = async (jobData) => {
  const response = await api.post('/company/createjob', jobData);
  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/company/updatejob/${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/company/deletejob/${jobId}`);
  return response.data;
};

export const getCompanyApplications = async (jobId) => {
  const response = await api.get(`/company/applications/${jobId}`);
  return response.data;
};

export const scheduleInterview = async (interviewData) => {
  const response = await api.put('/company/schedule-interview', interviewData);
  return response.data;
};

export const toggleApplicationStatus = async (statusData) => {
  const response = await api.put('/company/toggle-application-status', statusData);
  return response.data;
};
