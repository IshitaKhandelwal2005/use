import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., redirect to login)
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error occurred');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const controllerRef = useRef(null);

  // Cancel ongoing request when component unmounts
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const request = useCallback(async (config) => {
    // Cancel any ongoing request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setStatus('loading');

    try {
      const response = await api({
        ...config,
        signal: controller.signal,
      });

      setData(response.data);
      setStatus('success');
      return response.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
        setStatus('canceled');
      } else {
        setError(err.response?.data || { message: err.message });
        setStatus('error');
        throw err;
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setLoading(false);
    }
  }, []);

  // Helper methods for common HTTP methods
  const get = useCallback((url, params = {}, config = {}) => {
    return request({
      ...config,
      method: 'GET',
      url,
      params,
    });
  }, [request]);

  const post = useCallback((url, data = {}, config = {}) => {
    return request({
      ...config,
      method: 'POST',
      url,
      data,
    });
  }, [request]);

  const put = useCallback((url, data = {}, config = {}) => {
    return request({
      ...config,
      method: 'PUT',
      url,
      data,
    });
  }, [request]);

  const del = useCallback((url, config = {}) => {
    return request({
      ...config,
      method: 'DELETE',
      url,
    });
  }, [request]);

  const patch = useCallback((url, data = {}, config = {}) => {
    return request({
      ...config,
      method: 'PATCH',
      url,
      data,
    });
  }, [request]);

  return {
    data,
    error,
    loading,
    status,
    request,
    get,
    post,
    put,
    del,
    patch,
    reset: () => {
      setData(null);
      setError(null);
      setStatus(null);
    },
  };
};

export default useApi;
