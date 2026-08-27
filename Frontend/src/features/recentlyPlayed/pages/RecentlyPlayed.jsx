import { useEffect } from "react";
import { Link } from "react-router";
import { LuClock, LuTrash2, LuPlay } from "react-icons/lu";
import { useRecentlyPlayed } from "../hook/useRecentlyPlayed.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import SongRow from "../../songs/components/SongRow.jsx";
import Loading from "../../Shared/Components/Loading.jsx";
import PageShell from "../../Shared/Components/PageShell.jsx";
import PageHeader from "../../Shared/Components/PageHeader.jsx";
import EmptyState from "../../Shared/Components/EmptyState.jsx";

const RecentlyPlayed = () => {
  const { recentlyPlayed, loading, fetchRecentlyPlayed, clearRecentlyPlayed } = useRecentlyPlayed();
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
    <PageShell maxWidth="max-w-5xl">
      <PageHeader icon={LuClock} accent="#2bd6d6" title="Recently Played" description="Your history of mood tunes and previous listening sessions." action={songsList.length > 0 && (
            <button
              onClick={() => clearRecentlyPlayed()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-semibold text-[#94a3b8] hover:text-red-400 transition-colors"
            >
              <LuTrash2 size={14} />
              <span>Clear History</span>
            </button>
          )} />

        {/* List */}
        {songsList.length === 0 ? (
          <EmptyState
            icon={LuClock}
            title="No Listening History"
            description="Start playing songs on the home page or via the AI face scanner to build your listening history."
            action={<Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#d62b70] px-5 py-2 text-xs font-bold text-white"><LuPlay size={14} /><span>Listen to Songs</span></Link>}
          />
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
    </PageShell>
  );
};

export default RecentlyPlayed;
