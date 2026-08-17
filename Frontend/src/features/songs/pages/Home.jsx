import { useEffect, useMemo, useState } from "react";
import { LuPlay, LuHeart, LuClock } from "react-icons/lu";
import { useSongs } from "../hook/useSongs.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useRecentlyPlayed } from "../../recentlyPlayed/hook/useRecentlyPlayed.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import FaceExpression from '../../faceDetectExpression/components/FaceExpression'
import SongCard from "../components/SongCard.jsx";
import SongRow from "../components/SongRow.jsx";

const MOODS = ["happy", "sad", "neutral", "surprised"];

const Home = () => {
  const { songs, loading, fetchSongs } = useSongs();
  const { currentSong, isPlaying, playSong } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { bookmarks, isBookmarked, addBookmark, removeBookmark, fetchBookmarks } = useBookmarks();
  const { recentlyPlayed, fetchRecentlyPlayed } = useRecentlyPlayed();

  const [activeMood, setActiveMood] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBookmarks();
    fetchRecentlyPlayed();
  }, [isAuthenticated]);

  const genres = useMemo(() => {
    const set = new Set();
    songs.forEach((song) => song.genre?.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [songs]);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      if (activeMood && song.mood !== activeMood) return false;
      if (activeGenre && !song.genre?.includes(activeGenre)) return false;
      return true;
    });
  }, [songs, activeMood, activeGenre]);

  const topMoodHits = filteredSongs.slice(0, 5);
  const featuredSong = filteredSongs[0] || songs[0];

  const handleExpressionDetect = (mood) => {
    setActiveMood(mood);
    setActiveGenre(null);
  };

  const handlePlay = (song) => {
    playSong(song, filteredSongs);
  };

  const handleToggleBookmark = (songId) => {
    if (!isAuthenticated) return;
    if (isBookmarked(songId)) removeBookmark(songId);
    else addBookmark(songId);
  };

  return (
    <div className="min-h-screen bg-[#05080f] px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Hero */}
          {featuredSong && (
            <div className="relative mb-6 overflow-hidden rounded-2xl">
              <img
                src={featuredSong.posterUrl}
                alt={featuredSong.title}
                className="h-56 w-full object-cover md:h-72"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#05080f] via-[#05080f]/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <h1 className="font-['Bebas_Neue'] text-3xl tracking-[0.04em] text-white md:text-4xl">
                  {featuredSong.title}
                </h1>
                <p className="mt-1 text-sm text-[#b9c7de]">
                  {featuredSong.songArtist}
                </p>
                <button
                  onClick={() => handlePlay(featuredSong)}
                  className="mt-4 flex items-center gap-2 rounded-full bg-[#3d8bff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(61,139,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5aa3ff]"
                >
                  <LuPlay size={15} />
                  Play Now
                </button>
              </div>
            </div>
          )}

          {/* Mood filters */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveMood(null)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 ${
                !activeMood
                  ? "bg-[#3d8bff] text-white"
                  : "bg-white/4 text-[#5a7ab0] hover:text-[#dde8ff]"
              }`}
            >
              Show All
            </button>
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium capitalize transition-colors duration-150 ${
                  activeMood === mood
                    ? "bg-[#3d8bff] text-white"
                    : "bg-white/[0.04] text-[#5a7ab0] hover:text-[#dde8ff]"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Genre filters */}
          {genres.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() =>
                    setActiveGenre((prev) => (prev === genre ? null : genre))
                  }
                  className={`rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors duration-150 ${
                    activeGenre === genre
                      ? "border-[#3d8bff] text-[#3d8bff]"
                      : "border-white/10 text-[#5a7ab0] hover:text-[#dde8ff]"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {/* Top mood hits */}
          {topMoodHits.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#dde8ff]">
                Top {activeMood ? `${activeMood} ` : ""}Hits
              </h2>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {topMoodHits.map((song, idx) => (
                  <SongCard
                    key={song._id}
                    song={song}
                    rank={idx + 1}
                    isActive={currentSong?._id === song._id}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular songs list */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#dde8ff]">
              {activeMood || activeGenre ? "Matching Songs" : "Popular Songs"}
            </h2>

            {loading && (
              <p className="py-8 text-center text-sm text-[#5a7ab0]">
                Loading songs...
              </p>
            )}

            {!loading && filteredSongs.length === 0 && (
              <p className="py-8 text-center text-sm text-[#5a7ab0]">
                No songs match this filter yet.
              </p>
            )}

            <div className="flex flex-col gap-0.5">
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
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5a7ab0]">
              Face Scan
            </h3>
            <FaceExpression onExpressionDetect={handleExpressionDetect} />
            <p className="mt-2 text-[11px] text-[#5a7ab0]">
              Analyzing your vibe — syncing music to your expression.
            </p>
          </div>

          {isAuthenticated && (
            <>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#5a7ab0]">
                    <LuClock size={13} /> Recently Played
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {recentlyPlayed.length === 0 && (
                    <p className="text-[12px] text-[#5a7ab0]">
                      Nothing played yet.
                    </p>
                  )}
                  {recentlyPlayed.slice(0, 4).map((entry) => (
                    <button
                      key={entry._id}
                      onClick={() => handlePlay(entry.songId)}
                      className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition-colors duration-150 hover:bg-white/3"
                    >
                      <img
                        src={entry.songId?.posterUrl}
                        alt={entry.songId?.title}
                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-[#dde8ff]">
                          {entry.songId?.title}
                        </p>
                        <p className="truncate text-[11px] text-[#5a7ab0]">
                          {entry.songId?.songArtist}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#5a7ab0]">
                  <LuHeart size={13} /> My Bookmarks
                </h3>
                <div className="flex flex-col gap-2">
                  {bookmarks.length === 0 && (
                    <p className="text-[12px] text-[#5a7ab0]">
                      No bookmarks yet.
                    </p>
                  )}
                  {bookmarks.slice(0, 4).map((bookmark) => (
                    <button
                      key={bookmark._id}
                      onClick={() => handlePlay(bookmark.songId)}
                      className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition-colors duration-150 hover:bg-white/[0.03]"
                    >
                      <img
                        src={bookmark.songId?.posterUrl}
                        alt={bookmark.songId?.title}
                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-[#dde8ff]">
                          {bookmark.songId?.title}
                        </p>
                        <p className="truncate text-[11px] text-[#5a7ab0]">
                          {bookmark.songId?.songArtist}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Home;