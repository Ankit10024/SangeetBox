import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: () => Promise<string>;
      };
    };
  }
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isNetworkError: boolean;
  isTimeout: boolean;
}

export const axiosInstance = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 5000}/api`,
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    
    try {
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    } catch (error) {
      console.error('Failed to get auth token', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add any response transformation here
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 
              (error.code === 'ECONNABORTED' ? 'Request timeout' : 'Network Error'),
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED'
    };

    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      error: apiError
    });

    // Automatic retry for network errors or 5xx server errors
    if (apiError.isNetworkError || (apiError.status && apiError.status >= 500)) {
    const retryCount = (error.config as CustomRequestConfig)?.retryCount || 0;
      if (retryCount < 3) {
        const newConfig: CustomRequestConfig = {
          ...error.config,
          headers: error.config?.headers ? new AxiosHeaders(error.config.headers) : new AxiosHeaders(),
          retryCount: retryCount + 1,
          timeout: 10000 * (retryCount + 1) // Exponential backoff
        };
        console.log(`Retrying request (attempt ${retryCount + 1})`);
        return new Promise(resolve => 
          setTimeout(() => resolve(axiosInstance(newConfig)), 2000 * (retryCount + 1))
        );
      }
    }

    return Promise.reject(apiError);
  }
);

// Helper function for error handling in components
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 
           error.message || 
           'An unknown API error occurred';
  }
  return 'An unknown error occurred';
}
