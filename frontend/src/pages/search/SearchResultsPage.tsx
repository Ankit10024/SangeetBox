import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { usePlayerStore } from "../../stores/usePlayerStore";
import type { Song } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResultsPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const togglePlay = usePlayerStore((state) => state.togglePlay);

  const location = useLocation();
  const navigate = useNavigate();

  // Function to perform search based on query
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSongs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const songsResponse = await axios.get<Song[]>(`/api/songs/search?query=${encodeURIComponent(searchQuery)}`);
      const fetchedSongs = songsResponse.data || [];
      setSongs(fetchedSongs);

      // Automatically play the first song if available
      if (fetchedSongs.length > 0) {
        setCurrentSong(fetchedSongs[0]);
        togglePlay();
      }
    } catch (err) {
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    performSearch(query);
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  // On mount or when URL query parameter changes, update query state and perform search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("query") || "";
    setQuery(urlQuery);
    if (urlQuery) {
      performSearch(urlQuery);
    } else {
      setSongs([]);
    }
  }, [location.search]);

  const handleSongClick = (song: Song) => {
    // Navigate to song page from homepage
    navigate(`/song/${song._id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Songs</h1>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search songs"
          value={query}
          onChange={handleInputChange}
          className="flex-grow px-2 py-1 border border-gray-400 rounded text-black"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          Search
        </button>
      </form>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <h2 className="text-xl font-semibold mb-2">Songs</h2>
        {songs.length === 0 ? (
          <p>No songs found.</p>
        ) : (
          <ul className="space-y-4">
            {songs.map((song) => (
              <li
                key={song._id}
                className="p-3 border border-gray-300 rounded shadow-sm cursor-pointer hover:bg-gray-200 flex items-center gap-4"
                onClick={() => handleSongClick(song)}
              >
                <div className="flex flex-col flex-grow">
                  <p className="font-medium">{song.title} - {song.artist}</p>
                  <audio controls className="mt-1 w-full">
                    <source src={song.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
