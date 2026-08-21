import { useEffect } from "react";
import { Link } from "react-router";
import {
  // LuPlusCircle,
  LuMusic,
  LuLayers,
  LuHeart,
  LuUser,
  LuSparkles,
  LuUpload,
  LuTrash2
} from "react-icons/lu";
import { AiTwotonePlusCircle } from "react-icons/ai";
import { useAuth } from "../../auth/hook/useAuth.js";
import { useSongs } from "../../songs/hook/useSongs.js";
import { usePlaylists } from "../../playlists/hook/usePlaylist.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import SongRow from "../../songs/components/SongRow.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const { mySongs, fetchMySongs, deleteSong } = useSongs();
  const { playlists, fetchPlaylists, deletePlaylist } = usePlaylists();
  const { bookmarks, fetchBookmarks } = useBookmarks();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchMySongs(user.id || user._id);
    }
    fetchPlaylists();
    fetchBookmarks();
  }, [user, fetchMySongs, fetchPlaylists, fetchBookmarks]);

  const handlePlay = (song) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, mySongs);
    }
  };

  const handleDeleteSong = async (song) => {
    if (!window.confirm(`Delete "${song.title}"?`)) return;
    await deleteSong(song._id);
  };

  const handleDeletePlaylist = async (playlist) => {
    if (!window.confirm(`Delete playlist "${playlist.title}"?`)) return;
    await deletePlaylist(playlist._id);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
        
        {/* Dashboard Banner with User Specified GIF */}
        <div className="relative rounded-3xl overflow-hidden bg-[#16161a] border border-white/10 p-6 md:p-10 shadow-2xl mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            
            {/* Left Welcome Info */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d62b70]/20 border border-[#d62b70]/40 text-xs font-bold text-[#ffb1c4] mb-3">
                <LuSparkles size={14} />
                <span>Creator & Listener Hub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Montserrat'] text-white tracking-tight">
                Welcome back, {user?.username || "Viber"}!
              </h1>
              <p className="text-sm md:text-base text-[#94a3b8] mt-2 max-w-lg leading-relaxed">
                Manage your music library, check playback stats, and create new playlists synced to your vibes.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/upload-song"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white text-xs md:text-sm font-bold shadow-[0_4px_20px_rgba(214,43,112,0.4)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
                >
                  <LuUpload size={16} />
                  <span>Upload New Song</span>
                </Link>

                <Link
                  to="/create-playlist"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1f1f22] hover:bg-[#2a2a2d] border border-white/10 text-white text-xs md:text-sm font-semibold transition-all hover:scale-105"
                >
                  <LuLayers size={16} className="text-[#2bd6d6]" />
                  <span>New Playlist</span>
                </Link>
              </div>
            </div>

            {/* Right: User Specified GIF */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-64 h-52 sm:w-72 sm:h-56 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/40 group">
                <img
                  src="https://i.pinimg.com/originals/af/c5/cd/afc5cdc69c1408abff7a21c75ad53ba4.gif"
                  alt="NovaVibe Dashboard Aesthetic"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 text-[11px] font-bold text-white/90 drop-shadow-md">
                  🎧 Mood Sync Vibe
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-[#1f1f22]/60 border border-white/5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#d62b70]/15 text-[#ffb1c4] flex items-center justify-center">
                <LuMusic size={22} />
              </div>
              <div>
                <span className="block text-xl font-bold text-white">
                  {mySongs.length}
                </span>
                <span className="block text-[11px] text-[#94a3b8]">
                  Uploaded Songs
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1f1f22]/60 border border-white/5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#2bd6d6]/15 text-[#2bd6d6] flex items-center justify-center">
                <LuLayers size={22} />
              </div>
              <div>
                <span className="block text-xl font-bold text-white">
                  {playlists.length}
                </span>
                <span className="block text-[11px] text-[#94a3b8]">
                  Playlists Created
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1f1f22]/60 border border-white/5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#8b5cf6]/15 text-[#d0bcff] flex items-center justify-center">
                <LuHeart size={22} />
              </div>
              <div>
                <span className="block text-xl font-bold text-white">
                  {bookmarks.length}
                </span>
                <span className="block text-[11px] text-[#94a3b8]">
                  Saved Bookmarks
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1f1f22]/60 border border-white/5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center">
                <LuUser size={22} />
              </div>
              <div>
                <span className="block text-sm font-bold text-white truncate">
                  {user?.username || "Standard"}
                </span>
                <span className="block text-[11px] text-[#94a3b8]">
                  Account Status
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: User's Uploaded Songs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuMusic className="text-[#d62b70]" size={20} />
              <h2 className="text-xl font-bold font-['Montserrat'] text-white">
                My Uploaded Songs
              </h2>
            </div>
            <Link
              to="/upload-song"
              className="text-xs font-semibold text-[#ffb1c4] hover:underline"
            >
              + Upload Song
            </Link>
          </div>

          {mySongs.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#16161a]/40 border border-white/5 p-6">
              <p className="text-sm text-[#94a3b8] mb-3">
                You haven't uploaded any songs yet.
              </p>
              <Link
                to="/upload-song"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d62b70] text-white text-xs font-semibold"
              >
                <LuUpload size={14} />
                <span>Upload First Track</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mySongs.map((song, idx) => (
                <SongRow
                  key={song._id || idx}
                  song={song}
                  index={idx}
                  isActive={currentSong?._id === song._id}
                  isPlaying={currentSong?._id === song._id && isPlaying}
                  onPlay={handlePlay}
                  onDelete={handleDeleteSong}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: User's Playlists */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuLayers className="text-[#2bd6d6]" size={20} />
              <h2 className="text-xl font-bold font-['Montserrat'] text-white">
                My Playlists
              </h2>
            </div>
            <Link
              to="/create-playlist"
              className="text-xs font-semibold text-[#ffb1c4] hover:underline"
            >
              + Create Playlist
            </Link>
          </div>

          {playlists.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#16161a]/40 border border-white/5 p-6">
              <p className="text-sm text-[#94a3b8] mb-3">
                No playlists created yet.
              </p>
              <Link
                to="/create-playlist"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2bd6d6] text-black text-xs font-bold"
              >
                <AiTwotonePlusCircle size={14} />
                <span>Create Playlist</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl._id}
                  className="group rounded-2xl bg-[#16161a] border border-white/5 hover:border-white/20 p-3 transition-all hover:-translate-y-1"
                >
                  <Link to={`/playlist/${pl._id}`} className="block">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-[#1f1f22]">
                      <img
                        src={pl.thumbnailUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop"}
                        alt={pl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="truncate text-sm font-bold text-white group-hover:text-[#ffb1c4]">
                      {pl.title}
                    </h3>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">
                      {pl.songCount || pl.songs?.length || 0} tracks
                    </p>
                  </Link>
                  <button
                    onClick={() => handleDeletePlaylist(pl)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-red-400"
                    title="Delete playlist"
                  >
                    <LuTrash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
