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
   */
  static googleLogin() {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE}`;
  }

  static facebookLogin() {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.AUTH.FACEBOOK}`;
  }

  static linkedinLogin() {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.AUTH.LINKEDIN}`;
  }

  static appleLogin() {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.AUTH.APPLE}`;
  }

  /**
   * Logout - clear token
   */
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }
}

export default AuthService;

