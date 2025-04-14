import { create } from "zustand";
import { Playlist } from "../types";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface PlaylistStore {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;

  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  reset: () => void;  // Added reset function
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  isLoading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
      set({ error: errorMessage });
      toast.error(errorMessage || "Failed to load playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/playlists", { name });
      set((state) => ({ playlists: [...state.playlists, response.data] }));
      toast.success("Playlist created");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
      set({ error: errorMessage });
      toast.error(errorMessage || "Failed to create playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id: string) => {
    set({ isLoading: true, error: null });
    set((state) => ({
      playlists: state.playlists.filter((playlist) => playlist._id !== id),
    }));
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      toast.success("Playlist deleted");
    } catch (error: any) {
      set({ error: error.message });
      toast.error("Failed to delete playlist");
      set((state) => ({
        playlists: [...state.playlists],  // Rollback optimistic update
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ playlists: [], error: null, isLoading: false }),
}));
