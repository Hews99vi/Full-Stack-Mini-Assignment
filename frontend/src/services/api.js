// File: frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getAllFeedback = async (department = '') => {
  const params = department ? { department } : {};
  const response = await api.get('/feedback', { params });
  return response.data;
};

export const getFeedbackStats = async () => {
  const response = await api.get('/feedback/stats');
  return response.data;
};

export const updateFeedback = async (id, updateData) => {
  const response = await api.put(`/feedback/${id}`, updateData);
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};

export const bulkDeleteFeedback = async (ids) => {
  const response = await api.post('/feedback/bulk-delete', { ids });
  return response.data;
};

export const bulkUpdateFeedback = async (ids, updateData) => {
  const response = await api.post('/feedback/bulk-update', { ids, updateData });
  return response.data;
};

export default api;
