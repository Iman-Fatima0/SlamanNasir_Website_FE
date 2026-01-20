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

