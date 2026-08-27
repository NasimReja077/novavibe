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
  LuUser,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <LuSparkles size={32} className="text-[#94a3b8]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Song Not Found</h2>
        <p className="text-sm text-[#94a3b8] mb-8 max-w-sm">
          The track you are looking for might have been moved or removed.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white text-sm font-semibold hover:brightness-110 transition-all"
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
    <div className="min-h-screen bg-[#0c0c0f] text-[#e4e1e6] pb-36">
      {/* Soft top ambient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-[#d62b70]/10 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-sm font-medium text-[#94a3b8] hover:text-white mb-8 transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <LuArrowLeft size={16} />
          </span>
          Back to Library
        </Link>

        {/* ========== HERO TRACK CARD ========== */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141417]/80 backdrop-blur-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
          {/* Ambient glows */}
          <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#d62b70]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-[#2bd6d6]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              
              {/* Artwork */}
              <div className="relative shrink-0">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/15 group">
                  <img
                    src={targetSong.posterUrl}
                    alt={targetSong.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Playing badge */}
                  {isPlayingActive && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#d62b70]/60 px-2.5 py-1">
                      <div className="flex items-end gap-[2px] h-3">
                        <span className="w-[3px] bg-[#d62b70] h-full rounded-full animate-eq-1" />
                        <span className="w-[3px] bg-[#2bd6d6] h-[70%] rounded-full animate-eq-2" />
                        <span className="w-[3px] bg-[#8b5cf6] h-full rounded-full animate-eq-3" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffb1c4]">
                        Playing
                      </span>
                    </div>
                  )}
                </div>

                {/* Soft reflection under artwork */}
                <div className="absolute -bottom-6 left-4 right-4 h-8 bg-gradient-to-b from-black/40 to-transparent blur-md opacity-60 pointer-events-none" />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0 text-center lg:text-left flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d62b70]/15 border border-[#d62b70]/30 text-[#ffb1c4] text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d62b70]" />
                    {targetSong.mood} Mood
                  </span>

                  {targetSong.songLanguage && (
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#94a3b8] text-[11px] font-medium capitalize">
                      {targetSong.songLanguage}
                    </span>
                  )}
                </div>

                {/* Title & Artist */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Montserrat'] text-white tracking-tight leading-[1.1]">
                  {targetSong.title}
                </h1>
                <p className="mt-2 text-lg md:text-xl font-medium text-[#94a3b8]">
                  {targetSong.songArtist}
                </p>

                {/* Genre chips */}
                {targetSong.genre?.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-5">
                    {targetSong.genre.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 rounded-lg bg-[#1c1c20] border border-white/8 text-xs font-medium text-[#2bd6d6]"
                      >
                        #{g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={handlePlay}
                    className="group/btn relative flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(214,43,112,0.4)] hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    {isPlayingActive ? (
                      <>
                        <LuPause size={18} className="relative z-10" />
                        <span className="relative z-10">Pause Track</span>
                      </>
                    ) : (
                      <>
                        <LuPlay size={18} className="relative z-10 ml-0.5" />
                        <span className="relative z-10">Play Now</span>
                      </>
                    )}
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={handleToggleBookmark}
                      className={`flex items-center gap-2 rounded-full border px-5 py-3.5 text-sm font-semibold transition-all ${
                        bookmarked
                          ? "bg-[#d62b70]/15 border-[#d62b70]/40 text-[#ffb1c4]"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
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

            {/* ========== METADATA GRID ========== */}
            <div className="mt-10 pt-8 border-t border-white/8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: <LuUser size={18} />,
                  color: "text-[#ffb1c4]",
                  label: "Uploaded By",
                  value: targetSong.uploadedBy?.username || "Admin",
                },
                {
                  icon: <LuSparkles size={18} />,
                  color: "text-[#2bd6d6]",
                  label: "Mood Detection",
                  value: targetSong.mood,
                },
                {
                  icon: <LuGlobe size={18} />,
                  color: "text-[#8b5cf6]",
                  label: "Language",
                  value: targetSong.songLanguage || "English",
                },
                {
                  icon: <LuCalendar size={18} />,
                  color: "text-amber-400",
                  label: "Release Date",
                  value: targetSong.createdAt
                    ? new Date(targetSong.createdAt).toLocaleDateString()
                    : "Recent",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3.5 hover:bg-white/[0.05] transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                      {item.label}
                    </span>
                    <span className="block truncate text-sm font-semibold text-white capitalize">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== RELATED SONGS ========== */}
        {relatedSongs.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold font-['Montserrat'] text-white">
                More{" "}
                <span className="text-[#ffb1c4] capitalize">{targetSong.mood}</span> Vibes
              </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
              {relatedSongs.map((song) => (
                <div key={song._id} className="min-w-[180px] sm:min-w-[200px]">
                  <SongCard
                    song={song}
                    isActive={currentSong?._id === song._id}
                    isPlaying={currentSong?._id === song._id && isPlaying}
                    onPlay={(s) => playSong(s, songs)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsDetail;