import { useEffect } from "react";
import { Link } from "react-router";
import { LuPlus, LuLayers, LuPlay, LuMusic, LuTrash2 } from "react-icons/lu";
import { usePlaylists } from "../hook/usePlaylist.js";
import { usePlayer } from "../../player/hook/usePlayer.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import Loading from "../../Shared/Components/Loading.jsx";

const Playlists = () => {
  const { playlists, loading, fetchPlaylists, deletePlaylist } = usePlaylists();
  const { playSong } = usePlayer();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleDelete = async (playlist) => {
    if (!window.confirm(`Delete playlist "${playlist.title}"?`)) return;
    await deletePlaylist(playlist._id);
  };

  if (loading && playlists.length === 0) {
    return <Loading message="Loading playlists..." />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LuLayers className="text-[#2bd6d6]" size={22} />
              <h1 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white tracking-tight">
                Playlists
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#94a3b8]">
              Curated collections of mood tracks for every vibe.
            </p>
          </div>

          {isAuthenticated && (
            <Link
              to="/create-playlist"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white text-xs md:text-sm font-bold shadow-[0_4px_20px_rgba(214,43,112,0.4)] hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              <LuPlus size={16} />
              <span>Create Playlist</span>
            </Link>
          )}
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-[#16161a]/50 border border-white/5 p-8">
            <LuLayers className="mx-auto text-[#94a3b8] mb-3" size={36} />
            <h3 className="text-lg font-bold text-white">No Playlists Found</h3>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-sm mx-auto">
              Create your first personalized playlist to group your favorite mood songs together!
            </p>
            {isAuthenticated && (
              <Link
                to="/create-playlist"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d62b70] text-white text-xs font-bold"
              >
                <LuPlus size={14} />
                <span>Create Playlist Now</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="group relative rounded-2xl bg-[#16161a] border border-white/5 hover:border-white/20 p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
              >
                <Link to={`/playlist/${playlist._id}`} className="block">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#1f1f22]">
                    <img
                      src={playlist.thumbnailUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop"}
                      alt={playlist.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Song Count Badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                      <LuMusic size={10} />
                      <span>{playlist.songCount || playlist.songs?.length || 0}</span>
                    </div>

                    {/* Quick Play Trigger */}
                    {playlist.songs?.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const firstSong = typeof playlist.songs[0] === "object" ? playlist.songs[0] : null;
                          if (firstSong) playSong(firstSong, playlist.songs);
                        }}
                        className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#d62b70] text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200"
                        aria-label={`Play ${playlist.title}`}
                      >
                        <LuPlay size={14} className="ml-0.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="truncate text-sm font-bold text-white group-hover:text-[#ffb1c4] transition-colors">
                    {playlist.title}
                  </h3>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    {playlist.songCount || playlist.songs?.length || 0} tracks
                  </p>
                </Link>
                <button
                  onClick={() => handleDelete(playlist)}
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
      </div>
    </div>
  );
};

export default Playlists;
