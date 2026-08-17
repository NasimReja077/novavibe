import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LuHeart, LuPlay } from "react-icons/lu";
import { useBookmarks } from "../hook/useBookmarks.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import SongRow from "../../songs/components/SongRow.jsx";
import Loading from "../../Shared/Components/Loading.jsx";

const Bookmarks = () => {
  const { bookmarks, loading, fetchBookmarks, removeBookmark } = useBookmarks();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isAuthenticated } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks]);

  if (loading && bookmarks.length === 0) {
    return <Loading message="Loading your bookmarked songs..." />;
  }

  const rawSongs = bookmarks
    .map((bm) => bm.songId || bm)
    .filter((s) => s && s._id);

  const songsList = selectedMood
    ? rawSongs.filter((s) => s.mood?.toLowerCase() === selectedMood.toLowerCase())
    : rawSongs;

  const handlePlay = (song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, songsList);
    }
  };

  const handleToggleBookmark = (songId) => {
    removeBookmark(songId);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LuHeart className="text-[#d62b70]" size={24} />
              <h1 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white tracking-tight">
                My Bookmarks
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#94a3b8]">
              Your personally saved tracks and favorite mood vibes.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#16161a] border border-white/10 text-[#ffb1c4] self-start sm:self-auto">
            {rawSongs.length} {rawSongs.length === 1 ? "song" : "songs"} saved
          </span>
        </div>

        {/* Mood Filter Tabs */}
        {rawSongs.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide py-1">
            <button
              onClick={() => setSelectedMood(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                !selectedMood
                  ? "bg-[#d62b70] text-white shadow-[0_0_15px_rgba(214,43,112,0.4)]"
                  : "bg-[#16161a] text-[#94a3b8] hover:text-white border border-white/5"
              }`}
            >
              All Bookmarks
            </button>
            {["happy", "sad", "neutral", "surprised"].map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  selectedMood === mood
                    ? "bg-[#d62b70] text-white shadow-[0_0_15px_rgba(214,43,112,0.4)]"
                    : "bg-[#16161a] text-[#94a3b8] hover:text-white border border-white/5"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        )}

        {/* Bookmarks List */}
        {songsList.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-[#16161a]/50 border border-white/5 p-8">
            <LuHeart className="mx-auto text-[#94a3b8] mb-3" size={36} />
            <h3 className="text-lg font-bold text-white">No Bookmarks Saved</h3>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-sm mx-auto">
              Whenever you enjoy a track, tap the heart icon to save it here for quick access anytime!
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d62b70] text-white text-xs font-bold"
            >
              <LuPlay size={14} className="ml-0.5" />
              <span>Explore Songs</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {songsList.map((song, idx) => (
              <SongRow
                key={song._id || idx}
                song={song}
                index={idx}
                isActive={currentSong?._id === song._id}
                isPlaying={currentSong?._id === song._id && isPlaying}
                isBookmarked={true}
                onPlay={handlePlay}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
