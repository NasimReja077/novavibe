import { useEffect } from "react";
import { Link } from "react-router";
import { LuClock, LuTrash2, LuPlay } from "react-icons/lu";
import { useRecentlyPlayed } from "../hook/useRecentlyPlayed.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import SongRow from "../../songs/components/SongRow.jsx";
import Loading from "../../Shared/Components/Loading.jsx";

const RecentlyPlayed = () => {
  const { recentlyPlayed, loading, fetchRecentlyPlayed, clearHistory } = useRecentlyPlayed();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentlyPlayed();
    }
  }, [isAuthenticated, fetchRecentlyPlayed]);

  if (loading && recentlyPlayed.length === 0) {
    return <Loading message="Loading your listening history..." />;
  }

  const songsList = recentlyPlayed
    .map((entry) => entry.songId || entry)
    .filter((s) => s && s._id);

  const handlePlay = (song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, songsList);
    }
  };

  const handleToggleBookmark = (songId) => {
    if (!isAuthenticated) return;
    if (isBookmarked(songId)) removeBookmark(songId);
    else addBookmark(songId);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LuClock className="text-[#2bd6d6]" size={24} />
              <h1 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white tracking-tight">
                Recently Played
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#94a3b8]">
              Your history of mood tunes and previous listening sessions.
            </p>
          </div>

          {songsList.length > 0 && (
            <button
              onClick={() => clearHistory && clearHistory()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-semibold text-[#94a3b8] hover:text-red-400 transition-colors"
            >
              <LuTrash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* List */}
        {songsList.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-[#16161a]/50 border border-white/5 p-8">
            <LuClock className="mx-auto text-[#94a3b8] mb-3" size={36} />
            <h3 className="text-lg font-bold text-white">No Listening History</h3>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-sm mx-auto">
              Start playing songs on the home page or via the AI face scanner to build your listening history.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d62b70] text-white text-xs font-bold"
            >
              <LuPlay size={14} className="ml-0.5" />
              <span>Listen to Songs</span>
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
                isBookmarked={isBookmarked(song._id)}
                onPlay={handlePlay}
                onToggleBookmark={isAuthenticated ? handleToggleBookmark : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
