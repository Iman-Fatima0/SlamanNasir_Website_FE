/**
 * File Upload Service
 * Handles file uploads and previews for course content
 */

import { API_ENDPOINTS } from '@/constants';

export class UploadService {
  /**
   * Get base URL for API requests
   * @returns {string} Base URL
   */
  static getBaseURL() {
    // Use the same logic as apiClient
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      // In development, use proxy (no /api prefix needed)
      return '';
    }
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Get auth token
   * @returns {string} Auth token
   */
  static getAuthToken() {
    return globalThis.window?.localStorage.getItem('token') || '';
  }

  /**
   * Upload a video file
   * @param {File} file - Video file to upload
   * @returns {Promise<{success: boolean, data: {fullUrl: string, filename: string}}>}
   */
  static async uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);

    const baseURL = this.getBaseURL();
    const token = this.getAuthToken();
    const endpoint = `${baseURL}/api${API_ENDPOINTS.UPLOAD.VIDEO}`;

    // Debug logging
    console.log('Upload Video - Endpoint:', endpoint);
    console.log('Upload Video - File:', file.name, file.size, 'bytes');
    console.log('Upload Video - Has Token:', !!token);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: `Upload failed with status ${response.status}` 
        }));
        throw new Error(error.message || `Failed to upload video: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Upload an audio file
   * @param {File} file - Audio file to upload
   * @returns {Promise<{success: boolean, data: {fullUrl: string, filename: string}}>}
   */
  static async uploadAudio(file) {
    const formData = new FormData();
    formData.append('audio', file);

    const baseURL = this.getBaseURL();
    const token = this.getAuthToken();
    const endpoint = `${baseURL}/api${API_ENDPOINTS.UPLOAD.AUDIO}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: `Upload failed with status ${response.status}` 
        }));
        throw new Error(error.message || `Failed to upload audio: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Upload a PDF file
   * @param {File} file - PDF file to upload
   * @returns {Promise<{success: boolean, data: {fullUrl: string, filename: string}}>}
   */
  static async uploadPdf(file) {
    const formData = new FormData();
    formData.append('pdf', file);

    const baseURL = this.getBaseURL();
    const token = this.getAuthToken();
    const endpoint = `${baseURL}/api${API_ENDPOINTS.UPLOAD.PDF}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: `Upload failed with status ${response.status}` 
        }));
        throw new Error(error.message || `Failed to upload PDF: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Upload an image file
   * @param {File} file - Image file to upload
   * @returns {Promise<{success: boolean, data: {fullUrl: string, filename: string}}>}
   */
  static async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const baseURL = this.getBaseURL();
    const token = this.getAuthToken();
    const endpoint = `${baseURL}/api${API_ENDPOINTS.UPLOAD.IMAGE}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: `Upload failed with status ${response.status}` 
        }));
        throw new Error(error.message || `Failed to upload image: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Upload multiple lesson files at once
   * @param {Object} files - Object with file types as keys and File objects as values
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  static async uploadLesson(files) {
    const formData = new FormData();
    
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    const baseURL = this.getBaseURL();
    const token = this.getAuthToken();
    const endpoint = `${baseURL}/api${API_ENDPOINTS.UPLOAD.LESSON}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: `Upload failed with status ${response.status}` 
        }));
        throw new Error(error.message || `Failed to upload lesson files: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Get preview URL for a video file
   * @param {string} filename - Name of the video file
   * @returns {string} Preview URL
   */
  static getVideoPreviewUrl(filename) {
    const baseURL = this.getBaseURL();
    return `${baseURL}/api${API_ENDPOINTS.UPLOAD.PREVIEW.VIDEO(filename)}`;
  }

  /**
   * Get preview URL for an audio file
   * @param {string} filename - Name of the audio file
   * @returns {string} Preview URL
   */
  static getAudioPreviewUrl(filename) {
    const baseURL = this.getBaseURL();
    return `${baseURL}/api${API_ENDPOINTS.UPLOAD.PREVIEW.AUDIO(filename)}`;
  }

  /**
   * Get preview URL for a PDF file
   * @param {string} filename - Name of the PDF file
   * @returns {string} Preview URL
   */
  static getPdfPreviewUrl(filename) {
    const baseURL = this.getBaseURL();
    return `${baseURL}/api${API_ENDPOINTS.UPLOAD.PREVIEW.PDF(filename)}`;
  }

  /**
   * Get preview URL for an image file
   * @param {string} filename - Name of the image file
   * @returns {string} Preview URL
   */
  static getImagePreviewUrl(filename) {
    const baseURL = this.getBaseURL();
    return `${baseURL}/api${API_ENDPOINTS.UPLOAD.PREVIEW.IMAGE(filename)}`;
  }

  /**
   * Extract filename from URL
   * @param {string} url - Full URL or filename
   * @returns {string} Filename
   */
  static extractFilename(url) {
    if (!url) return '';
    // If it's already just a filename, return it
    if (!url.includes('/')) return url;
    // Extract filename from URL
    const parts = url.split('/');
    return parts.at(-1) || '';
  }
}

export default UploadService;

