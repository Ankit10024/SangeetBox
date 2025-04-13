import { axiosInstance } from "../lib/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      set({ isAdmin: response.data.admin });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to check admin status";
      set({ 
        isAdmin: false, 
        error: errorMessage
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
