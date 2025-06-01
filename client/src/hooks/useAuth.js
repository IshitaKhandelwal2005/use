import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';
import useApi from './useApi';
import config from '../config';

/**
 * Custom authentication hook
 * @returns {Object} Auth context with user, login, logout, and loading state
 */
const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const api = useApi();
  
  // Get stored user data from localStorage
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage(
    config.storageKeys.userData,
    null
  );
  
  // Get stored auth token from localStorage
  const [token, setToken, removeToken] = useLocalStorage(
    config.storageKeys.authToken,
    null
  );
  
  const [user, setUser] = useState(storedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the auth token in axios headers and update auth state
  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(config.storageKeys.authToken, newToken);
      api.request.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      delete api.request.defaults.headers.common['Authorization'];
      localStorage.removeItem(config.storageKeys.authToken);
    }
  }, [api.request]);

  // Check if user is authenticated by validating the token
  const checkAuth = useCallback(async () => {
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      setAuthToken(token);
      const userData = await api.get(config.api.endpoints.auth.me);
      
      if (userData) {
        setUser(userData);
        setStoredUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      
      // If no user data is returned, clear auth state
      logout();
      return false;
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token, setStoredUser, setAuthToken, api]);

  // Initialize auth state on mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    
    verifyAuth();
  }, [checkAuth]);

  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<boolean>} Whether login was successful
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post(config.api.endpoints.auth.login, {
        email,
        password,
      });
      
      const { token: authToken, user: userData } = response.data;
      
      // Store token and user data
      setToken(authToken);
      setAuthToken(authToken);
      setUser(userData);
      setStoredUser(userData);
      setIsAuthenticated(true);
      
      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<boolean>} Whether registration was successful
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post(config.api.endpoints.auth.register, userData);
      
      // Auto-login after registration if successful
      if (response.data.token) {
        return await login(userData.email, userData.password);
      }
      
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    // Clear auth state
    removeToken();
    removeStoredUser();
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [navigate, removeStoredUser, removeToken, setAuthToken]);

  /**
   * Update the current user's data
   * @param {Object} updatedUser - Updated user data
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    setStoredUser(updatedUser);
  }, [setStoredUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateUser,
    checkAuth,
  };
};

export default useAuth;
