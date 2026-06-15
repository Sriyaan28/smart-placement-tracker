import axios from 'axios';

// vercel backend: https://smart-placement-tracker-sigma.vercel.app/api
// local backend: http://localhost:4000/api
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // This allows sending cookies (e.g. JWT token) with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling global errors (e.g., unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // You can trigger a global logout or redirect here if the token expires
      console.warn('Unauthorized request or session expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
