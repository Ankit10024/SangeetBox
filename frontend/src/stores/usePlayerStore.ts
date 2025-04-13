import { create } from "zustand";
import { Song } from "../types";
import { useChatStore } from "./useChatStore";

const emitSocketActivity = (socket: any, title?: string, artist?: string, isPlaying: boolean = false) => {
  if (socket?.auth) {
    try {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: isPlaying && title ? `Playing ${title} by ${artist}` : "Idle",
      });
    } catch (socketError) {
      console.error("Socket activity update failed:", socketError);
    }
  }
};

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  error: string | null;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  error: null,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    try {
      if (songs.length === 0) {
        set({ error: "No songs in album" });
        return;
      }

      const song = songs[startIndex];
      if (!song) {
        set({ error: "Invalid song index" });
        return;
      }

      const socket = useChatStore.getState().socket;
      emitSocketActivity(socket, song.title, song.artist);

      set({
        queue: songs,
        currentSong: song,
        currentIndex: startIndex,
        isPlaying: true,
        error: null,
      });
    } catch (error) {
      console.error("Play album error:", error);
      set({ error: "Failed to play album" });
    }
  },

  setCurrentSong: (song: Song | null) => {
    try {
      if (!song) {
        set({ error: "No song provided" });
        return;
      }

      const socket = useChatStore.getState().socket;
      emitSocketActivity(socket, song.title, song.artist);

      const songIndex = get().queue.findIndex((s) => s._id === song._id);
      set({
        currentSong: song,
        isPlaying: true,
        currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        error: null,
      });
    } catch (error) {
      console.error("Set current song error:", error);
      set({ error: "Failed to set current song" });
    }
  },

  togglePlay: () => {
    try {
      const willStartPlaying = !get().isPlaying;
      const currentSong = get().currentSong;

      const socket = useChatStore.getState().socket;
      emitSocketActivity(socket, currentSong?.title, currentSong?.artist, willStartPlaying);

      set({
        isPlaying: willStartPlaying,
        error: null,
      });
    } catch (error) {
      console.error("Toggle play error:", error);
      set({ error: "Failed to toggle play state" });
    }
  },

  playNext: () => {
    try {
      const { currentIndex, queue } = get();
      const nextIndex = currentIndex + 1;

      if (nextIndex < queue.length) {
        const nextSong = queue[nextIndex];
        if (!nextSong) {
          set({ error: "Invalid next song" });
          return;
        }

        const socket = useChatStore.getState().socket;
        emitSocketActivity(socket, nextSong.title, nextSong.artist);

        set({
          currentSong: nextSong,
          currentIndex: nextIndex,
          isPlaying: true,
          error: null,
        });
      } else {
        set({ isPlaying: false });
        const socket = useChatStore.getState().socket;
        emitSocketActivity(socket);
      }
    } catch (error) {
      console.error("Play next error:", error);
      set({ error: "Failed to play next song" });
    }
  },

  playPrevious: () => {
    try {
      const { currentIndex, queue } = get();
      const prevIndex = currentIndex - 1;

      if (prevIndex >= 0) {
        const prevSong = queue[prevIndex];
        if (!prevSong) {
          set({ error: "Invalid previous song" });
          return;
        }

        const socket = useChatStore.getState().socket;
        emitSocketActivity(socket, prevSong.title, prevSong.artist);

        set({
          currentSong: prevSong,
          currentIndex: prevIndex,
          isPlaying: true,
          error: null,
        });
      } else {
        set({ isPlaying: false });
        const socket = useChatStore.getState().socket;
        emitSocketActivity(socket);
      }
    } catch (error) {
      console.error("Play previous error:", error);
      set({ error: "Failed to play previous song" });
    }
  },
}));
