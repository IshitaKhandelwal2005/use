// Application configuration
const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5002',
    timeout: 10000, // 10 seconds
    endpoints: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        me: '/api/auth/me'
      },
      conversations: {
        base: '/api/conversations',
        start: '/api/conversations/start',
        message: (id) => `/api/conversations/${id}/message`,
        end: (id) => `/api/conversations/${id}/end`,
        feedback: (id) => `/api/conversations/${id}/feedback`,
        user: (userId) => `/api/conversations/user/${userId}`
      },
      scenarios: '/api/scenarios',
      users: '/api/users'
    }
  },

  // Application settings
  app: {
    name: process.env.REACT_APP_NAME || 'Loan Agent Trainer',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    defaultPageSize: 10,
    maxUploadSize: 5 * 1024 * 1024, // 5MB
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    refreshInterval: 5 * 60 * 1000 // 5 minutes
  },

  // Feature flags
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.NODE_ENV === 'development',
    enableMockData: process.env.REACT_APP_ENABLE_MOCK_DATA === 'true'
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#4361ee',
      secondary: '#3f37c9',
      success: '#4bb543',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#212529'
    },
    toast: {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50]
    },
    form: {
      debounce: 300,
      maxLength: 5000
    }
  },

  // Local storage keys
  storageKeys: {
    authToken: 'auth_token',
    userData: 'user_data',
    themePreference: 'theme_preference',
    recentSearches: 'recent_searches'
  },

  // Regular expressions
  regex: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^\+?[1-9]\d{9,14}$/
  },

  // Default messages
  messages: {
    errors: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPassword: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      networkError: 'Network error. Please check your connection and try again.',
      unauthorized: 'You are not authorized to perform this action',
      notFound: 'The requested resource was not found',
      serverError: 'An unexpected error occurred. Please try again later.'
    },
    success: {
      saved: 'Changes saved successfully',
      deleted: 'Item deleted successfully',
      created: 'Item created successfully',
      updated: 'Item updated successfully'
    },
    confirm: {
      delete: 'Are you sure you want to delete this item? This action cannot be undone.'
    }
  }
};

export default config;
