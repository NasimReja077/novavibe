import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LuHeart, LuPlay } from "react-icons/lu";
import { useBookmarks } from "../hook/useBookmarks.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import SongRow from "../../songs/components/SongRow.jsx";
import Loading from "../../Shared/Components/Loading.jsx";
import PageShell from "../../Shared/Components/PageShell.jsx";
import PageHeader from "../../Shared/Components/PageHeader.jsx";
import EmptyState from "../../Shared/Components/EmptyState.jsx";

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
    <PageShell maxWidth="max-w-5xl">
      <PageHeader
        icon={LuHeart}
        title="My Bookmarks"
        description="Your personally saved tracks and favorite mood vibes."
        action={<span className="self-start rounded-full border border-white/10 bg-[#16161a] px-3 py-1 text-xs font-semibold text-[#ffb1c4] sm:self-auto">
            {rawSongs.length} {rawSongs.length === 1 ? "song" : "songs"} saved
          </span>}
      />

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
          <EmptyState
            icon={LuHeart}
            title="No Bookmarks Saved"
            description="Whenever you enjoy a track, tap the heart icon to save it here for quick access anytime!"
            action={<Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#d62b70] px-5 py-2 text-xs font-bold text-white"><LuPlay size={14} /><span>Explore Songs</span></Link>}
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
                isBookmarked={true}
                onPlay={handlePlay}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
    </PageShell>
  );
};

export default Bookmarks;
