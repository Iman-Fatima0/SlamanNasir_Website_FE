/**
 * Authentication API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';
import { mapUser } from '@/utils/dataMapper';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signup(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to sign up');
    }

    return response;
  }

  /**
   * Login user
   */
  static async login(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to login');
    }

    return response;
  }

  /**
   * Get current user
   */
  static async getMe() {
    const response = await apiClient.get(
      API_ENDPOINTS.AUTH.ME
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to get user data');
    }

    // Transform backend data to frontend format
    return {
      ...response,
      data: {
        ...response.data,
        user: mapUser(response.data?.user),
      },
    };
  }

  /**
   * Update current user profile
   * Note: Backend must have PUT /api/auth/me endpoint configured
   */
  static async updateProfile(userData) {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.ME,
        userData
      );

      if (response.success === false) {
        const error = new Error(response.message || 'Failed to update profile');
        error.status = response.status;
        throw error;
      }

      // Transform backend data to frontend format
      return {
        ...response,
        data: {
          ...response.data,
          user: mapUser(response.data?.user),
        },
      };
    } catch (error) {
      // Preserve status code if available
      if (error.status) {
        throw error;
      }
      // If it's an axios error, extract status
      if (error.response?.status) {
        const newError = new Error(error.message || 'Failed to update profile');
        newError.status = error.response.status;
        throw newError;
      }
      throw error;
    }
  }

  /**
   * Change password (for authenticated users)
   */
  static async changePassword(passwordData) {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        passwordData
      );

      if (response.success === false) {
        const error = new Error(response.message || 'Failed to change password');
        error.status = response.status;
        throw error;
      }

      return response;
    } catch (error) {
      // Preserve status code if available
      if (error.status) {
        throw error;
      }
      // If it's an axios error, extract status
      if (error.response?.status) {
        const status = error.response.status;
        let message = error.message || 'Failed to change password';
        
        // Provide specific error messages for common status codes
        if (status === 404) {
          message = 'Password change endpoint not found. Please contact support or use the "Forgot Password" feature.';
        } else if (status === 401) {
          message = 'Your session has expired. Please log in again.';
        } else if (status === 403) {
          message = 'You do not have permission to change your password.';
        } else if (status === 400) {
          message = error.response.data?.message || 'Invalid password. Please check your current password and try again.';
        } else if (status >= 500) {
          message = 'Server error. Please try again later or contact support.';
        }
        
        const newError = new Error(message);
        newError.status = status;
        throw newError;
      }
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email) {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to send reset email');
    }

    return response;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token, password) {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to reset password');
    }

    return response;
  }

  /**
   * OAuth login - redirects to provider
   * @param {string} courseId - Optional courseId to include in state for checkout flow
   * 
   * Note: OAuth redirects must use full backend URL (not proxy) because window.location.href
   * needs to navigate away from the current page. Backend is at http://localhost:3000
   */
  static googleLogin(courseId = null) {
    const state = courseId ? `?state=${encodeURIComponent(courseId)}` : '';
    // Always use full backend URL for OAuth redirects (backend port 3000)
    const oauthUrl = `${API_BASE_URL}/api${API_ENDPOINTS.AUTH.GOOGLE}${state}`;
    globalThis.location.href = oauthUrl;
  }

  static facebookLogin(courseId = null) {
    const state = courseId ? `?state=${encodeURIComponent(courseId)}` : '';
    const oauthUrl = `${API_BASE_URL}/api${API_ENDPOINTS.AUTH.FACEBOOK}${state}`;
    globalThis.location.href = oauthUrl;
  }

  static linkedinLogin(courseId = null) {
    const state = courseId ? `?state=${encodeURIComponent(courseId)}` : '';
    const oauthUrl = `${API_BASE_URL}/api${API_ENDPOINTS.AUTH.LINKEDIN}${state}`;
    globalThis.location.href = oauthUrl;
  }

  static appleLogin(courseId = null) {
    const state = courseId ? `?state=${encodeURIComponent(courseId)}` : '';
    const oauthUrl = `${API_BASE_URL}/api${API_ENDPOINTS.AUTH.APPLE}${state}`;
    globalThis.location.href = oauthUrl;
  }

  /**
   * Logout - clear token
   */
  static logout() {
    if (typeof globalThis !== 'undefined' && globalThis.window) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      globalThis.location.href = '/';
    }
  }
}

export default AuthService;

