/**
 * API client configuration using Axios
 */

import axios from 'axios';

class ApiClient {
  constructor() {
    // In development, use proxy (no /api prefix needed)
    // In production, use full URL from env
    const baseURL = import.meta.env.PROD 
      ? (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
      : '/api';

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (globalThis.window !== undefined) {
          const token = globalThis.window.localStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors
        if (error.response) {
          const apiError = {
            success: false,
            message: error.response.data?.message || 'An error occurred',
            error: error.response.data?.error,
            errors: error.response.data?.errors,
          };
          return Promise.reject(apiError);
        }

        if (error.request) {
          const apiError = {
            success: false,
            message: 'Network error. Please check your connection.',
          };
          return Promise.reject(apiError);
        }

        const apiError = {
          success: false,
          message: error.message || 'An unexpected error occurred',
        };
        return Promise.reject(apiError);
      }
    );
  }

  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

