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

  // Checks if the current user has admin privileges by calling the backend API
  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      set({ isAdmin: response.data.admin });
    } catch (error: unknown) {
      // Improved error handling with type guard
      let errorMessage = "Failed to check admin status";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      set({
        isAdmin: false,
        error: errorMessage,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Resets the store state to initial values
  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
