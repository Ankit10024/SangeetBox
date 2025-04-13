import { AxiosInstance } from 'axios';

declare module '@/lib/axios' {
  export const axiosInstance: AxiosInstance;
  export interface ApiError {
    message: string;
    status?: number;
    data?: any;
  }
}
