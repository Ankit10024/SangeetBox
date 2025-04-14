import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../../stores/usePlaylistStore";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

const PlaylistManagementPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { playlists, fetchPlaylists, createPlaylist, deletePlaylist, isLoading, error } = usePlaylistStore();
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log("Fetching playlists...");
      fetchPlaylists();
    }
  }, [fetchPlaylists, isLoaded, isSignedIn]);

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim() === "") return;
    try {
      console.log("Creating playlist with name:", newPlaylistName.trim());
      await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    } catch (e) {
      console.error("Error creating playlist:", e);
    }
  };

  // Redirect to sign in if user is not signed in
  if (isLoaded && !isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Playlists</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="px-2 py-1 border border-gray-400 rounded text-black"
        />
        <button
          onClick={handleCreatePlaylist}
          disabled={isLoading}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Create
        </button>
      </div>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      {isLoading && <p>Loading playlists...</p>}
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist._id} className="mb-2 flex justify-between items-center">
            <span>{playlist.name}</span>
            <button
              onClick={() => deletePlaylist(playlist._id)}
              disabled={isLoading}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistManagementPage;
