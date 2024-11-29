import axios from 'axios';

// Base URL for your backend
const API_URL = 'http://localhost:5000/api';

export const createConversation = (userId, sellerId, token) =>
  axios.post(
    `${API_URL}/conversations`,
    { userId: sellerId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  export const getMessages = (conversationId, token) =>
    axios.get(`${API_URL}/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

export const sendMessage = (conversationId, text, token) =>
  axios.post(
    `${API_URL}/messages`,
    { conversationId, text },
    { headers: { Authorization: `Bearer ${token}` } },
  );

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to set token in headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
