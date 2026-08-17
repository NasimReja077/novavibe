import { useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  LuPlay,
  LuPause,
  LuHeart,
  LuArrowLeft,
  LuSparkles,
  LuCalendar,
  LuGlobe,
  LuUser
} from "react-icons/lu";
import { useSongs } from "../hook/useSongs.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import SongCard from "../components/SongCard.jsx";
import Loading from "../../Shared/Components/Loading.jsx";

const SongsDetail = () => {
  const { id } = useParams();
  const { currentSong: songDetail, songs, loading, fetchSong, fetchSongs } = useSongs();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) fetchSong(id);
    if (songs.length === 0) fetchSongs();
  }, [id, fetchSong, fetchSongs, songs.length]);

  const targetSong = songDetail?._id === id ? songDetail : songs.find((s) => s._id === id);

  if (loading && !targetSong) {
    return <Loading message="Loading song vibes..." />;
  }

  if (!targetSong) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Song Not Found</h2>
        <p className="text-sm text-[#94a3b8] mb-6">
          The track you are looking for might have been moved or removed.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full bg-[#d62b70] text-white text-sm font-semibold hover:brightness-110"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const isCurrentActive = currentSong?._id === targetSong._id;
  const isPlayingActive = isCurrentActive && isPlaying;
  const bookmarked = isBookmarked(targetSong._id);

  const relatedSongs = songs.filter(
    (s) => s._id !== targetSong._id && s.mood === targetSong.mood
  );

  const handlePlay = () => {
    if (isCurrentActive) {
      togglePlay();
    } else {
      playSong(targetSong, songs);
    }
  };

  const handleToggleBookmark = () => {
    if (!isAuthenticated) return;
    if (bookmarked) removeBookmark(targetSong._id);
    else addBookmark(targetSong._id);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-8">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-white mb-6 transition-colors"
        >
          <LuArrowLeft size={16} />
          <span>Back to Library</span>
        </Link>

        {/* Hero Track Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#16161a] border border-white/10 p-6 md:p-10 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d62b70]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2bd6d6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Artwork */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/15 group">
              <img
                src={targetSong.posterUrl}
                alt={targetSong.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {isPlayingActive && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#d62b70] flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-3">
                    <div className="w-0.5 bg-[#d62b70] h-full animate-eq-1 rounded-full" />
                    <div className="w-0.5 bg-[#d62b70] h-full animate-eq-2 rounded-full" />
                    <div className="w-0.5 bg-[#d62b70] h-full animate-eq-3 rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-[#ffb1c4] uppercase tracking-wider">
                    Playing
                  </span>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 text-center md:text-left flex flex-col justify-between">
              <div>
                {/* Mood Tag */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#d62b70]/20 border border-[#d62b70]/40 text-[#ffb1c4] text-xs font-bold uppercase tracking-wider">
                    {targetSong.mood} Mood
                  </span>
                  {targetSong.songLanguage && (
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#94a3b8] text-xs font-medium capitalize">
                      {targetSong.songLanguage}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Montserrat'] text-white tracking-tight">
                  {targetSong.title}
                </h1>
                <p className="text-lg md:text-xl font-semibold text-[#94a3b8] mt-2">
                  {targetSong.songArtist}
                </p>

                {/* Genre chips */}
                {targetSong.genre?.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                    {targetSong.genre.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 rounded-md bg-[#1f1f22] border border-white/10 text-xs text-[#2bd6d6] font-medium"
                      >
                        #{g}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white font-bold text-sm shadow-[0_4px_25px_rgba(214,43,112,0.45)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlayingActive ? (
                    <>
                      <LuPause size={18} />
                      <span>Pause Track</span>
                    </>
                  ) : (
                    <>
                      <LuPlay size={18} className="ml-0.5" />
                      <span>Play Now</span>
                    </>
                  )}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={handleToggleBookmark}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors"
                  >
                    <LuHeart
                      size={18}
                      className={bookmarked ? "fill-[#d62b70] text-[#d62b70]" : ""}
                    />
                    <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details Metadata grid */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ffb1c4]">
                <LuUser size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">
                  Uploaded By
                </span>
                <span className="block truncate text-xs font-semibold text-white">
                  {targetSong.uploadedBy?.username || "Admin"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#2bd6d6]">
                <LuSparkles size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">
                  Mood Detection
                </span>
                <span className="block capitalize text-xs font-semibold text-white">
                  {targetSong.mood}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#8b5cf6]">
                <LuGlobe size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">
                  Language
                </span>
                <span className="block capitalize text-xs font-semibold text-white">
                  {targetSong.songLanguage || "English"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400">
                <LuCalendar size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">
                  Release Date
                </span>
                <span className="block text-xs font-semibold text-white">
                  {targetSong.createdAt ? new Date(targetSong.createdAt).toLocaleDateString() : "Recent"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Mood Hits */}
        {relatedSongs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold font-['Montserrat'] text-white mb-4">
              More {targetSong.mood} Vibes
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {relatedSongs.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  isActive={currentSong?._id === song._id}
                  isPlaying={currentSong?._id === song._id && isPlaying}
                  onPlay={(s) => playSong(s, songs)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsDetail;
