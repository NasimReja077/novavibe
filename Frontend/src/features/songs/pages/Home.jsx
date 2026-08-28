import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router";
import { filterSongs } from "../utils/filterSongs.js";
import {
  LuPlay,
  LuPause,
  LuClock,
  LuSparkles,
  LuFrown,
  LuMeh,
  LuLaugh,
  LuMusic,
  LuFlame,
  LuLayers,
  LuChevronRight,
  LuArrowRight,
  LuHeart
} from "react-icons/lu";
import { useSongs } from "../hook/useSongs.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useRecentlyPlayed } from "../../recentlyPlayed/hook/useRecentlyPlayed.js";
import { usePlaylists } from "../../playlists/hook/usePlaylist.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import FaceExpression from "../../faceDetectExpression/components/FaceExpression.jsx";
import SongCard from "../components/SongCard.jsx";
import SongRow from "../components/SongRow.jsx";
import Loading from "../../Shared/Components/Loading.jsx";

const MOOD_META = [
  { key: "happy", label: "Happy", icon: LuLaugh, color: "#d62b70", bg: "rgba(214, 43, 112, 0.12)", border: "rgba(214, 43, 112, 0.35)", desc: "High energy & upbeat" },
  { key: "sad", label: "Sad", icon: LuFrown, color: "#2bd6d6", bg: "rgba(43, 214, 214, 0.12)", border: "rgba(43, 214, 214, 0.35)", desc: "Soft & melancholic" },
  { key: "neutral", label: "Neutral", icon: LuMeh, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)", border: "rgba(139, 92, 246, 0.35)", desc: "Balanced & chill" },
  { key: "surprised", label: "Surprised", icon: LuSparkles, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.35)", desc: "Dynamic & bold" },
];

const SONGS_PER_PAGE = 10;

const Home = () => {
  const { songs, loading, fetchSongs } = useSongs();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { bookmarks, isBookmarked, addBookmark, removeBookmark, fetchBookmarks } = useBookmarks();
  const { recentlyPlayed, fetchRecentlyPlayed } = useRecentlyPlayed();
  const { playlists, fetchPlaylists } = usePlaylists();

  const [activeMood, setActiveMood] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);
  const [songPage, setSongPage] = useState(1);
  const { searchTerm, clearSearch } = useOutletContext() || {};

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, [fetchSongs, fetchPlaylists]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBookmarks();
    fetchRecentlyPlayed();
  }, [isAuthenticated, fetchBookmarks, fetchRecentlyPlayed]);

  // Extract all unique genres
  const genres = useMemo(() => {
    const set = new Set();
    songs.forEach((song) => song.genre?.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [songs]);

  // Filter songs by the active controls and global search term
  const filteredSongs = useMemo(() => {
    return filterSongs(songs, { mood: activeMood, genre: activeGenre, search: searchTerm });
  }, [songs, activeMood, activeGenre, searchTerm]);

  const isAllSongsLibrary = !searchTerm && !activeMood && !activeGenre;
  const displayedSongs = useMemo(() => {
    return isAllSongsLibrary
      ? filteredSongs.slice(0, songPage * SONGS_PER_PAGE)
      : filteredSongs;
  }, [filteredSongs, isAllSongsLibrary, songPage]);

  useEffect(() => {
    setSongPage(1);
  }, [activeMood, activeGenre, searchTerm]);

  // Top mood hits for slider
  const topMoodHits = useMemo(() => {
    return filteredSongs.slice(0, 10);
  }, [filteredSongs]);

  // Featured hero track
  const featuredSong = currentSong || filteredSongs[0] || songs[0];

  const handleExpressionDetect = (mood) => {
    const normalized = mood?.toLowerCase();
    if (["happy", "sad", "neutral", "surprised"].includes(normalized)) {
      setActiveMood(normalized);
    }
  };

  const handlePlay = (song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, filteredSongs.length > 0 ? filteredSongs : songs);
    }
  };

  const handleToggleBookmark = (songId) => {
    if (!isAuthenticated) return;
    if (isBookmarked(songId)) removeBookmark(songId);
    else addBookmark(songId);
  };

  if (loading && songs.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loading message="Curating your mood music..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        {/* Main Grid: Left Fluid Content (9 cols) + Right Contextual Sidebar (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT MAIN CONTENT */}
          <div className="min-w-0 flex flex-col gap-8">

            {/* HERO SPOTLIGHT BANNER */}
            {featuredSong && (

              <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] group min-h-[380px] md:min-h-[440px] flex items-end">
                {/* Background Artwork */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] ease-out group-hover:scale-105 will-change-transform"

                  style={{
                    backgroundImage: `url(${featuredSong.posterUrl ||
                      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop"})`,
                  }}
                />

                {/* Multi-layer ambient overlays for depth + readability */}

                <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0f] via-[#0c0c0f]/70 to-transparent" />

                <div className="absolute inset-0 bg-linear-to-r from-[#0c0c0f]/95 via-[#0c0c0f]/50 to-transparent" />

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#d62b70]/15 via-transparent to-transparent opacity-70" />

                {/* Soft bottom glow */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#d62b70]/10 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 w-full p-6 sm:p-8 md:p-10 max-w-3xl">
                  {/* Status Pill */}
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1.5 mb-5 shadow-lg">

                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d62b70] opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d62b70]" />
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ffb1c4]">
                      {currentSong?._id === featuredSong._id && isPlaying ? "Now Playing" : "Featured Vibe"}
                    </span>

                    {isPlaying && currentSong?._id === featuredSong._id && (
                      <div className="flex items-end gap-[3px] h-3.5 ml-0.5">
                        <span className="w-[3px] bg-[#d62b70] h-full rounded-full animate-eq-1" />
                        <span className="w-[3px] bg-[#2bd6d6] h-[70%] rounded-full animate-eq-2" />
                        <span className="w-[3px] bg-[#8b5cf6] h-full rounded-full animate-eq-3" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black font-['Montserrat'] text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
                    {featuredSong.title}
                  </h1>

                  {/* Artist */}
                  <p className="mt-2 text-lg sm:text-xl md:text-2xl font-medium text-[#cbd5e1]/90 drop-shadow-md">
                    {featuredSong.songArtist}
                  </p>

                  {/* Metadata Pills */}
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 px-3.5 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Mood
                      </span>
                      <span className="text-xs font-bold capitalize text-[#ffb1c4]">
                        {featuredSong.mood || "Balanced"}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 px-3.5 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Genre
                      </span>
                      <span className="text-xs font-bold text-[#2bd6d6] max-w-[140px] truncate">
                        {featuredSong.genre?.join(", ") || "Pop"}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 px-3.5 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Lang
                      </span>
                      <span className="text-xs font-bold capitalize text-white">
                        {featuredSong.songLanguage || "English"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handlePlay(featuredSong)}
                      className="group/btn relative flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(214,43,112,0.4)] hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                    >
                      {/* subtle shine */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                      {currentSong?._id === featuredSong._id && isPlaying ? (
                        <>
                          <LuPause size={18} className="relative z-10" />
                          <span className="relative z-10">Pause</span>
                        </>
                      ) : (
                        <>
                          <LuPlay size={18} className="relative z-10 ml-0.5" />
                          <span className="relative z-10">Play Now</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/song/${featuredSong._id}`}
                      className="flex items-center gap-2 rounded-full bg-white/8 hover:bg-white/15 backdrop-blur-md border border-white/12 hover:border-white/25 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200"
                    >
                      <LuSparkles size={16} className="text-[#ffb1c4]" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* MOOD EXPRESSION CATEGORY CARDS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LuSparkles className="text-[#d62b70]" size={18} />
                  <h2 className="text-lg md:text-xl font-bold font-['Montserrat'] text-white tracking-tight">
                    Explore By Mood
                  </h2>
                </div>
                {activeMood && (
                  <button
                    onClick={() => setActiveMood(null)}
                    className="text-xs font-semibold text-[#ffb1c4] hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {MOOD_META.map((m) => {
                  const Icon = m.icon;
                  const count = songs.filter((s) => s.mood?.toLowerCase() === m.key).length;
                  const isSelected = activeMood === m.key;

                  return (
                    <div
                      key={m.key}
                      onClick={() => setActiveMood(isSelected ? null : m.key)}
                      className={`relative flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${isSelected
                          ? "bg-[#1f1f22] border-[#d62b70] shadow-[0_0_25px_rgba(214,43,112,0.3)] -translate-y-1"
                          : "bg-[#16161a]/70 border-white/5 hover:bg-[#1f1f22]/70 hover:border-white/15 hover:-translate-y-0.5"
                        }`}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm"
                        style={{ backgroundColor: m.bg, color: m.color, border: `1px solid ${m.border}` }}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white capitalize">
                          {m.label}
                        </p>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5">
                          {count} {count === 1 ? "track" : "tracks"}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d62b70] shadow-[0_0_8px_#d62b70]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* HORIZONTAL GENRE TABS */}
            <section className="border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                <button
                  onClick={() => setActiveGenre(null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${!activeGenre
                      ? "bg-[#d62b70] text-white shadow-[0_0_15px_rgba(214,43,112,0.4)]"
                      : "bg-[#16161a] text-[#94a3b8] hover:text-white hover:bg-[#1f1f22] border border-white/5"
                    }`}
                >
                  All Genres
                </button>

                {genres.map((genre) => {
                  const isSelected = activeGenre === genre;
                  return (
                    <button
                      key={genre}
                      onClick={() => setActiveGenre(isSelected ? null : genre)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isSelected
                          ? "bg-[#d62b70] text-white shadow-[0_0_15px_rgba(214,43,112,0.4)]"
                          : "bg-[#16161a] text-[#94a3b8] hover:text-white hover:bg-[#1f1f22] border border-white/5"
                        }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* TOP MOOD HITS SLIDER (HORIZONTAL CAROUSEL) */}
            {topMoodHits.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LuFlame className="text-[#d62b70]" size={18} />
                    <h2 className="text-lg md:text-xl font-bold font-['Montserrat'] text-white tracking-tight">
                      Top {activeMood ? `${activeMood} ` : ""}Mood Hits
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-[#94a3b8]">
                    {topMoodHits.length} tracks
                  </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide">
                  {topMoodHits.map((song, idx) => (
                    <SongCard
                      key={song._id}
                      song={song}
                      rank={idx + 1}
                      isActive={currentSong?._id === song._id}
                      isPlaying={currentSong?._id === song._id && isPlaying}
                      onPlay={handlePlay}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* PLAYLISTS SECTION CAROUSEL */}
            {playlists.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LuLayers className="text-[#2bd6d6]" size={18} />
                    <h2 className="text-lg md:text-xl font-bold font-['Montserrat'] text-white tracking-tight">
                      Curated Playlists
                    </h2>
                  </div>
                  <Link
                    to="/playlists"
                    className="flex items-center gap-1 text-xs font-semibold text-[#ffb1c4] hover:text-white transition-colors"
                  >
                    <span>View All</span>
                    <LuChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {playlists.slice(0, 4).map((pl) => (
                    <Link
                      key={pl._id}
                      to={`/playlist/${pl._id}`}
                      className="group relative rounded-2xl overflow-hidden bg-[#16161a] border border-white/5 hover:border-white/20 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#1f1f22]">
                        <img
                          src={pl.thumbnailUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop"}
                          alt={pl.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white">
                          {pl.songCount || pl.songs?.length || 0} Songs
                        </div>
                      </div>
                      <p className="truncate text-xs md:text-sm font-bold text-white group-hover:text-[#ffb1c4] transition-colors">
                        {pl.title}
                      </p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">
                        Playlist
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* POPULAR / MATCHING SONGS TABLE */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LuMusic className="text-[#8b5cf6]" size={18} />
                  <h2 className="text-lg md:text-xl font-bold font-['Montserrat'] text-white tracking-tight">
                    {searchTerm ? "Search Results" : activeMood || activeGenre ? "Matching Songs" : "All Songs Library"}
                  </h2>
                </div>
                <span className="text-xs text-[#94a3b8]">
                  {isAllSongsLibrary && displayedSongs.length < filteredSongs.length
                    ? `${displayedSongs.length} of ${filteredSongs.length}`
                    : `${filteredSongs.length} available`}
                </span>
              </div>

              {filteredSongs.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[#16161a]/40 border border-white/5">
                  <p className="text-sm font-medium text-[#94a3b8]">
                    No songs found for {searchTerm ? `"${searchTerm}"` : "the current filters"}.
                  </p>
                  <button
                    onClick={() => {
                      setActiveMood(null);
                      setActiveGenre(null);
                      clearSearch?.();
                    }}
                    className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {displayedSongs.map((song, idx) => (
                    <SongRow
                      key={song._id}
                      song={song}
                      index={idx}
                      isActive={currentSong?._id === song._id}
                      isPlaying={currentSong?._id === song._id && isPlaying}
                      isBookmarked={isBookmarked(song._id)}
                      onPlay={handlePlay}
                      onToggleBookmark={isAuthenticated ? handleToggleBookmark : null}
                    />
                  ))}
                  {isAllSongsLibrary && displayedSongs.length < filteredSongs.length && (
                    <button
                      type="button"
                      onClick={() => setSongPage((page) => page + 1)}
                      className="mt-3 self-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#d62b70]/50 hover:bg-[#d62b70]/15"
                    >
                      Load More Songs
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR (CONTEXTUAL PANELS) */}
          <aside className="flex flex-col gap-6 w-full sticky top-20">

            {/* 1. Face Expression Scanner Card */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                  <LuSparkles className="text-[#d62b70]" size={14} />
                  Realtime Mood AI
                </h3>
              </div>
              <FaceExpression onExpressionDetect={handleExpressionDetect} />
              <p className="text-[11px] text-[#94a3b8] mt-2 px-1 leading-relaxed">
                Our vision model detects your real-time facial expression and tunes the playlist to match your vibe.
              </p>
            </div>

            {/* 2. Recently Played vertical panel */}
            {isAuthenticated && (
              <div className="rounded-2xl bg-[#16161a]/80 border border-white/5 p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    <LuClock className="text-[#2bd6d6]" size={14} />
                    Recently Played
                  </h3>
                  <Link
                    to="/recently-played"
                    className="text-[11px] font-semibold text-[#ffb1c4] hover:underline"
                  >
                    See All
                  </Link>
                </div>

                {recentlyPlayed.length === 0 ? (
                  <p className="text-xs text-[#94a3b8] py-3 text-center">
                    No recently played tracks yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentlyPlayed.slice(0, 4).map((entry) => {
                      const track = entry.songId || entry;
                      if (!track?._id) return null;
                      return (
                        <div
                          key={entry._id || track._id}
                          onClick={() => handlePlay(track)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <img
                            src={track.posterUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop"}
                            alt={track.title}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white group-hover:text-[#ffb1c4] transition-colors">
                              {track.title}
                            </p>
                            <p className="truncate text-[10.5px] text-[#94a3b8]">
                              {track.songArtist}
                            </p>
                          </div>
                          <button
                            className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#d62b70] text-[#94a3b8] group-hover:text-white flex items-center justify-center transition-colors"
                            aria-label={`Play ${track.title}`}
                          >
                            <LuPlay size={12} className="ml-0.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. My Bookmarks vertical panel */}
            {isAuthenticated && (
              <div className="rounded-2xl bg-[#16161a]/80 border border-white/5 p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    <LuHeart className="text-[#d62b70]" size={14} />
                    My Bookmarks
                  </h3>
                  <Link
                    to="/bookmarks"
                    className="text-[11px] font-semibold text-[#ffb1c4] hover:underline"
                  >
                    See All
                  </Link>
                </div>

                {bookmarks.length === 0 ? (
                  <p className="text-xs text-[#94a3b8] py-3 text-center">
                    No bookmarked tracks yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {bookmarks.slice(0, 4).map((bm) => {
                      const track = bm.songId || bm;
                      if (!track?._id) return null;
                      return (
                        <div
                          key={bm._id || track._id}
                          onClick={() => handlePlay(track)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <img
                            src={track.posterUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop"}
                            alt={track.title}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white group-hover:text-[#ffb1c4] transition-colors">
                              {track.title}
                            </p>
                            <p className="truncate text-[10.5px] text-[#94a3b8]">
                              {track.songArtist}
                            </p>
                          </div>
                          <button
                            className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#d62b70] text-[#94a3b8] group-hover:text-white flex items-center justify-center transition-colors"
                            aria-label={`Play ${track.title}`}
                          >
                            <LuPlay size={12} className="ml-0.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. Quick Playlists Preview Widget */}
            <div className="rounded-2xl bg-[#16161a]/80 border border-white/5 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  <LuLayers className="text-[#8b5cf6]" size={14} />
                  Top Playlists
                </h3>
                <Link
                  to="/playlists"
                  className="text-[11px] font-semibold text-[#ffb1c4] hover:underline"
                >
                  Explore
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {playlists.slice(0, 3).map((pl) => (
                  <Link
                    key={pl._id}
                    to={`/playlist/${pl._id}`}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <img
                      src={pl.thumbnailUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop"}
                      alt={pl.title}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white group-hover:text-[#ffb1c4] transition-colors">
                        {pl.title}
                      </p>
                      <p className="truncate text-[10.5px] text-[#94a3b8]">
                        {pl.songCount || pl.songs?.length || 0} Songs
                      </p>
                    </div>
                    <LuArrowRight size={14} className="text-[#94a3b8] group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;