import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "../stores/useAuthStore";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "../stores/useMusicStore";
import { usePlayerStore } from "../stores/usePlayerStore";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSongsBySearch = useMusicStore((state) => state.fetchSongsBySearch);
  const setSearchQuery = useMusicStore((state) => state.setSearchQuery);
  const searchResults = useMusicStore((state) => state.searchResults);

  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const togglePlay = usePlayerStore((state) => state.togglePlay);

  // Handles changes in the search input field
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clears the search input and resets the search query in the store
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
  };

  // Handles the search form submission
  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      // Set the search query in the store and fetch songs
      setSearchQuery(searchTerm.trim());
      await fetchSongsBySearch(searchTerm.trim());
      // If search results exist, play the first song
      if (searchResults.length > 0) {
        setCurrentSong(searchResults[0]);
        togglePlay();
      }
      // If already on the search page, do not navigate again
      if (location.pathname !== "/search") {
        // Navigate to the search results page with the query as a URL parameter
        navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      }
    } else {
      // If search term is empty, clear the search query in the store
      setSearchQuery("");
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 sticky top-0 bg-zinc-800/75 
      backdrop-blur-md z-10 border-b border-zinc-800"
    >
      {/* Clickable logo that routes to home */}
      <Link to="/" className="flex gap-2 items-center">
        <img src="/SangeetBox.png" className="size-8" alt="SangeetBox logo" />
        <span className="font-semibold text-white">SangeetBox</span>
      </Link>

      {/* Conditionally render search bar only if not on search page */}
      {location.pathname !== "/search" && (
        <form onSubmit={handleSearchSubmit} className="flex items-center relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-2 py-1 rounded-l bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-zinc-600 hover:bg-zinc-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 rounded-r bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      )}

      <div className="flex items-center gap-4">
        {/* Show admin dashboard button if user is admin */}
        {isAdmin && (
          <>
            <Link 
              to="/admin" 
              className={cn(buttonVariants({ variant: "outline" }), "text-white border-zinc-600")}
            >
              <LayoutDashboardIcon className="size-4 mr-2" />
              Admin Dashboard
            </Link>
          </>
        )}
        <Link
          to="/playlists"
          className={cn(buttonVariants({ variant: "outline" }), "text-white border-zinc-600")}
        >
          Playlists
        </Link>

        {/* Show Sign In buttons when logged out */}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        {/* Show Clerk User Button when logged in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default Topbar;
