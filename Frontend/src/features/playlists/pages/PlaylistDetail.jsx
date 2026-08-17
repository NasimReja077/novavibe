import { useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  LuPlay,
  LuPause,
  LuArrowLeft,
  LuMusic,
  LuCalendar
} from "react-icons/lu";
import { usePlaylists } from "../hook/usePlaylist.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import SongRow from "../../songs/components/SongRow.jsx";
import Loading from "../../Shared/Components/Loading.jsx";

const PlaylistDetail = () => {
  const { id } = useParams();
  const { currentPlaylist, playlists, loading, fetchPlaylist, fetchPlaylists } = usePlaylists();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) fetchPlaylist(id);
    if (playlists.length === 0) fetchPlaylists();
  }, [id, fetchPlaylist, fetchPlaylists, playlists.length]);

  const targetPlaylist = currentPlaylist?._id === id ? currentPlaylist : playlists.find((p) => p._id === id);

  if (loading && !targetPlaylist) {
    return <Loading message="Loading playlist vibes..." />;
  }

  if (!targetPlaylist) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Playlist Not Found</h2>
        <p className="text-sm text-[#94a3b8] mb-6">
          This playlist does not exist or may have been deleted.
        </p>
        <Link
          to="/playlists"
          className="px-5 py-2.5 rounded-full bg-[#d62b70] text-white text-sm font-semibold hover:brightness-110"
        >
          View All Playlists
        </Link>
      </div>
    );
  }

  const playlistSongs = targetPlaylist.songs || [];
  const isCurrentInPlaylist = playlistSongs.some(
    (s) => (s._id || s) === currentSong?._id
  );

  const handlePlayAll = () => {
    if (playlistSongs.length === 0) return;
    const firstTrack = typeof playlistSongs[0] === "object" ? playlistSongs[0] : null;
    if (firstTrack) {
      playSong(firstTrack, playlistSongs);
    }
  };

  const handlePlaySong = (song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, playlistSongs);
    }
  };

  const handleToggleBookmark = (songId) => {
    if (!isAuthenticated) return;
    if (isBookmarked(songId)) removeBookmark(songId);
    else addBookmark(songId);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-8">
        
        {/* Back Link */}
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-white mb-6 transition-colors"
        >
          <LuArrowLeft size={16} />
          <span>All Playlists</span>
        </Link>

        {/* Playlist Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-[#16161a] border border-white/10 p-6 md:p-8 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8">
            
            {/* Thumbnail */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/15 bg-[#1f1f22]">
              <img
                src={targetPlaylist.thumbnailUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop"}
                alt={targetPlaylist.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <span className="text-[11px] uppercase font-bold text-[#ffb1c4] tracking-widest">
                Playlist
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Montserrat'] text-white mt-1 tracking-tight">
                {targetPlaylist.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#94a3b8] mt-3">
                <span className="flex items-center gap-1">
                  <LuMusic size={14} className="text-[#2bd6d6]" />
                  <span>{playlistSongs.length} songs</span>
                </span>
                {targetPlaylist.createdAt && (
                  <span className="flex items-center gap-1">
                    <LuCalendar size={14} />
                    <span>Created {new Date(targetPlaylist.createdAt).toLocaleDateString()}</span>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={handlePlayAll}
                  disabled={playlistSongs.length === 0}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white font-bold text-xs md:text-sm shadow-[0_4px_25px_rgba(214,43,112,0.45)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isCurrentInPlaylist && isPlaying ? (
                    <>
                      <LuPause size={17} />
                      <span>Pause Playlist</span>
                    </>
                  ) : (
                    <>
                      <LuPlay size={17} className="ml-0.5" />
                      <span>Play All Songs</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <section>
          <h2 className="text-lg font-bold font-['Montserrat'] text-white mb-4">
            Tracks in this Playlist
          </h2>

          {playlistSongs.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#16161a]/40 border border-white/5 p-6">
              <p className="text-sm text-[#94a3b8]">
                No tracks in this playlist yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {playlistSongs.map((song, idx) => {
                const track = typeof song === "object" ? song : { _id: song, title: "Track", songArtist: "Artist" };
                return (
                  <SongRow
                    key={track._id || idx}
                    song={track}
                    index={idx}
                    isActive={currentSong?._id === track._id}
                    isPlaying={currentSong?._id === track._id && isPlaying}
                    isBookmarked={isBookmarked(track._id)}
                    onPlay={handlePlaySong}
                    onToggleBookmark={isAuthenticated ? handleToggleBookmark : null}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PlaylistDetail;
