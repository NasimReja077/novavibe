import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
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
  LuArrowRight
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

const Home = () => {
  const { songs, loading, fetchSongs } = useSongs();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { bookmarks, isBookmarked, addBookmark, removeBookmark, fetchBookmarks } = useBookmarks();
  const { recentlyPlayed, fetchRecentlyPlayed } = useRecentlyPlayed();
  const { playlists, fetchPlaylists } = usePlaylists();

  const [activeMood, setActiveMood] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);

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

  // Filter songs by active mood and genre
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      if (activeMood && song.mood?.toLowerCase() !== activeMood.toLowerCase()) return false;
      if (activeGenre && !song.genre?.includes(activeGenre)) return false;
      return true;
    });
  }, [songs, activeMood, activeGenre]);

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
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
        
        {/* Main Grid: Left Fluid Content (9 cols) + Right Contextual Sidebar (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-8 items-start">
          
          {/* LEFT MAIN CONTENT */}
          <div className="min-w-0 flex flex-col gap-8">
            
            {/* HERO SPOTLIGHT BANNER */}
            {featuredSong && (
              <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group min-h-[360px] md:min-h-[400px] flex items-end">
                {/* Background Artwork */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${featuredSong.posterUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop"})`,
                  }}
                />

                {/* Ambient Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/75 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f12]/90 via-[#0f0f12]/40 to-transparent" />

                {/* Hero Content Card */}
                <div className="relative z-10 p-6 md:p-8 w-full max-w-2xl">
                  {/* Now Playing / Featured Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1b1e]/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-white mb-3 shadow-md">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62b70] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d62b70]" />
                    </span>
                    <span className="text-[#ffb1c4] uppercase tracking-wider text-[10px]">
                      {currentSong?._id === featuredSong._id && isPlaying ? "Now Playing" : "Featured Vibe"}
                    </span>
                    {isPlaying && currentSong?._id === featuredSong._id && (
                      <div className="flex items-end gap-0.5 h-3 ml-1">
                        <div className="w-0.5 bg-[#d62b70] h-full animate-eq-1 rounded-full" />
                        <div className="w-0.5 bg-[#2bd6d6] h-full animate-eq-2 rounded-full" />
                        <div className="w-0.5 bg-[#8b5cf6] h-full animate-eq-3 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Title & Artist */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Montserrat'] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-tight">
                    {featuredSong.title}
                  </h1>
                  <h2 className="text-lg md:text-2xl font-semibold text-[#94a3b8] mt-1 drop-shadow-md">
                    {featuredSong.songArtist}
                  </h2>

                  {/* Metadata Chips Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">
                        Artist
                      </span>
                      <span className="block truncate text-xs md:text-sm font-semibold text-white mt-0.5">
                        {featuredSong.songArtist}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">
                        Mood
                      </span>
                      <span className="block capitalize text-xs md:text-sm font-bold text-[#ffb1c4] mt-0.5">
                        {featuredSong.mood || "Balanced"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">
                        Genre
                      </span>
                      <span className="block truncate text-xs md:text-sm font-semibold text-[#2bd6d6] mt-0.5">
                        {featuredSong.genre?.join(", ") || "Pop"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">
                        Language
                      </span>
                      <span className="block capitalize text-xs md:text-sm font-semibold text-white mt-0.5">
                        {featuredSong.songLanguage || "English"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => handlePlay(featuredSong)}
                      className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#d62b70] via-[#d62b70] to-[#8b5cf6] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_25px_rgba(214,43,112,0.45)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {currentSong?._id === featuredSong._id && isPlaying ? (
                        <>
                          <LuPause size={17} />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <LuPlay size={17} className="ml-0.5" />
                          <span>Play Now</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/song/${featuredSong._id}`}
                      className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-3 text-sm font-semibold text-white border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      <LuSparkles size={15} className="text-[#ffb1c4]" />
                      <span>Details & Moods</span>
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
                      className={`relative flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                        isSelected
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
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    !activeGenre
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
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                        isSelected
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                    {activeMood || activeGenre ? "Matching Songs" : "All Songs Library"}
                  </h2>
                </div>
                <span className="text-xs text-[#94a3b8]">
                  {filteredSongs.length} available
                </span>
              </div>

              {filteredSongs.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[#16161a]/40 border border-white/5">
                  <p className="text-sm font-medium text-[#94a3b8]">
                    No songs found matching current mood or genre filters.
                  </p>
                  <button
                    onClick={() => {
                      setActiveMood(null);
                      setActiveGenre(null);
                    }}
                    className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredSongs.map((song, idx) => (
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