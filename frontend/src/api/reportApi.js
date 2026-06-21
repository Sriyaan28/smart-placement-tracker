import axiosInstance from './axios';

export const submitReport = async (reportData) => {
    try {
        const response = await axiosInstance.post('/report/create', reportData);
        return { success: true, payload: response.data.payload, message: response.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to submit report' };
    }
};
