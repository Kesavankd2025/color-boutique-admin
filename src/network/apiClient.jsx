import axios, { InternalAxiosRequestConfig } from "axios";
import config from '../config/config';

export const BASE_URL = config.apiUrl;
export const IMAGE_BASE_URL = config.imageBaseUrl;
export const IMAGE_URL = config.imageBaseUrl;
export const Download_URL = config.fileDownloadUrl;

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (config.debug) {
      console.error('API Error:', error);
    }
    
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'Server error'
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Network error'
      });
    } else {
      return Promise.reject({
        status: 0,
        message: error.message
      });
    }
  }
);

export default apiClient;
