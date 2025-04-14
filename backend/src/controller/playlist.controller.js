import Playlist from "../models/playlist.model.js";

export const getPlaylists = async (req, res) => {
  try {
    console.log("getPlaylists req.auth:", req.auth);
    const userId = req.auth.userId;
    const playlists = await Playlist.find({ userId }).populate("songs");
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Failed to get playlists", error: error.message });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    console.log("createPlaylist req.auth:", req.auth);
    const userId = req.auth.userId;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Playlist name is required" });
    }
    const newPlaylist = new Playlist({ name, userId, songs: [] });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Failed to create playlist", error: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    console.log("deletePlaylist req.auth:", req.auth);
    const userId = req.auth.userId;
    const playlistId = req.params.id;
    const playlist = await Playlist.findOne({ _id: playlistId, userId });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    await Playlist.deleteOne({ _id: playlistId });
    res.json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete playlist", error: error.message });
  }
};
