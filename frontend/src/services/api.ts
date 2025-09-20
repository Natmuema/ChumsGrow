import axios, { AxiosInstance } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await this.post('/token/refresh/', { 
                refresh: refreshToken 
              });
              localStorage.setItem('access_token', response.access);
              error.config.headers.Authorization = `Bearer ${response.access}`;
              return this.axiosInstance(error.config);
            } catch (refreshError) {
              localStorage.clear();
              window.location.href = '/login';
            }
          }
        }
        
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    return this.axiosInstance.get(url, { params });
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    return this.axiosInstance.post(url, data);
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    return this.axiosInstance.put(url, data);
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    return this.axiosInstance.patch(url, data);
  }

  public async delete<T>(url: string): Promise<T> {
    return this.axiosInstance.delete(url);
  }
}

export default new ApiService();