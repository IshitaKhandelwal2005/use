import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5002',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API: Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me'),
};

// Conversation API
export const conversationAPI = {
  // Start a new conversation
  start: (data) => {
    console.log('API: Starting conversation with data:', data);
    return api.post('/api/conversations/start', data);
  },
  
  // Legacy method for backward compatibility
  startConversation: (scenario, customerProfile) => {
    console.log('API: Starting conversation with scenario:', scenario);
    console.log('API: Customer profile:', customerProfile);
    return api.post('/api/conversations/start', { scenario, customerProfile });
  },
  
  // Send a message in the conversation
  sendMessage: (conversationId, data) => {
    console.log('API: Sending message:', { conversationId, data });
    return api.post(`/api/conversations/${conversationId}/message`, data);
  },
  
  // End the conversation
  end: (conversationId) => {
    console.log('API: Ending conversation:', conversationId);
    return api.post(`/api/conversations/${conversationId}/end`);
  },
  
  // Legacy method for backward compatibility
  endConversation: (conversationId) => {
    console.log('API: Ending conversation:', conversationId);
    return api.post(`/api/conversations/${conversationId}/end`);
  },
  
  // Analyze conversation performance
  analyze: (conversationId) => {
    console.log('API: Analyzing conversation:', conversationId);
    return api.post(`/api/conversations/${conversationId}/analyze`);
  },
  
  // Get conversation history
  getConversationHistory: (page = 1, limit = 10) => 
    api.get('/api/conversations/history', { params: { page, limit } }),

  // Legacy feedback method (deprecated in favor of analyze)
  getFeedback: (conversationId) => {
    console.log('API: Getting feedback for conversation:', conversationId);
    return api.get(`/api/conversations/${conversationId}/feedback`);
  },

  getConversationAnalysis: async (conversationId) => {
    try {
      // Get the analysis which includes the feedback data
      const response = await api.post(`/api/conversations/${conversationId}/analyze`);
      console.log('Analysis response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in getConversationAnalysis:', error);
      throw new Error(error.response?.data?.message || 'Failed to get conversation analysis');
    }
  },
};

export default api;
