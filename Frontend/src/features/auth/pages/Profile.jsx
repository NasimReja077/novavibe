import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  LuUser,
  LuMail,
  LuMusic,
  LuLayers,
  LuHeart,
  LuClock,
  LuLogOut,
  LuSparkles,
  LuShieldCheck,
  LuIdCard
} from "react-icons/lu";
import { useAuth } from "../hook/useAuth.js";
import { useSongs } from "../../songs/hook/useSongs.js";
import { usePlaylists } from "../../playlists/hook/usePlaylist.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useRecentlyPlayed } from "../../recentlyPlayed/hook/useRecentlyPlayed.js";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { mySongs, fetchMySongs } = useSongs();
  const { playlists, fetchPlaylists } = usePlaylists();
  const { bookmarks, fetchBookmarks } = useBookmarks();
  const { recentlyPlayed, fetchRecentlyPlayed } = useRecentlyPlayed();

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchMySongs(user.id || user._id);
    }
    fetchPlaylists();
    fetchBookmarks();
    fetchRecentlyPlayed();
  }, [user]);

  const handleLogout = async () => {
    const resultAction = await logout();
    if (resultAction?.meta?.requestStatus === "fulfilled") {
      toast.success("Logged out successfully");
    }
    navigate("/login");
  };

  const initial = (user?.username || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-4xl px-4 md:px-8 py-8">
        
        {/* Profile Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#16161a] border border-white/10 p-6 md:p-10 shadow-2xl mb-8">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d62b70]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-tr from-[#d62b70] via-[#8b5cf6] to-[#2bd6d6] flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-[0_4px_25px_rgba(214,43,112,0.45)] border-2 border-white/20 shrink-0">
              {initial}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d62b70]/15 border border-[#d62b70]/30 text-xs font-bold text-[#ffb1c4] mb-2">
                <LuShieldCheck size={14} />
                <span>Verified NovaVibe Listener</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Montserrat'] text-white tracking-tight">
                {user?.username || "NovaVibe User"}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs md:text-sm text-[#94a3b8] mt-2">
                <span className="flex items-center gap-1.5">
                  <LuMail size={14} className="text-[#2bd6d6]" />
                  <span>{user?.email || "user@novavibe.ai"}</span>
                </span>
                {user?.id && (
                  <span className="flex items-center gap-1.5">
                    <LuIdCard size={14} className="text-[#8b5cf6]" />
                    <span className="font-mono text-[11px]">{user.id}</span>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-[#d62b70] hover:bg-[#d62b70]/90 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/10 text-xs font-semibold text-red-400 transition-colors"
                >
                  <LuLogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <Link
              to="/dashboard"
              className="p-4 rounded-2xl bg-[#1f1f22]/60 hover:bg-[#1f1f22] border border-white/5 transition-all text-center sm:text-left"
            >
              <LuMusic className="text-[#d62b70] mb-2 mx-auto sm:mx-0" size={20} />
              <span className="block text-xl font-bold text-white">
                {mySongs.length}
              </span>
              <span className="block text-[11px] text-[#94a3b8]">
                Songs Uploaded
              </span>
            </Link>

            <Link
              to="/playlists"
              className="p-4 rounded-2xl bg-[#1f1f22]/60 hover:bg-[#1f1f22] border border-white/5 transition-all text-center sm:text-left"
            >
              <LuLayers className="text-[#2bd6d6] mb-2 mx-auto sm:mx-0" size={20} />
              <span className="block text-xl font-bold text-white">
                {playlists.length}
              </span>
              <span className="block text-[11px] text-[#94a3b8]">
                Playlists Created
              </span>
            </Link>

            <Link
              to="/bookmarks"
              className="p-4 rounded-2xl bg-[#1f1f22]/60 hover:bg-[#1f1f22] border border-white/5 transition-all text-center sm:text-left"
            >
              <LuHeart className="text-[#8b5cf6] mb-2 mx-auto sm:mx-0" size={20} />
              <span className="block text-xl font-bold text-white">
                {bookmarks.length}
              </span>
              <span className="block text-[11px] text-[#94a3b8]">
                Saved Bookmarks
              </span>
            </Link>

            <Link
              to="/recently-played"
              className="p-4 rounded-2xl bg-[#1f1f22]/60 hover:bg-[#1f1f22] border border-white/5 transition-all text-center sm:text-left"
            >
              <LuClock className="text-amber-400 mb-2 mx-auto sm:mx-0" size={20} />
              <span className="block text-xl font-bold text-white">
                {recentlyPlayed.length}
              </span>
              <span className="block text-[11px] text-[#94a3b8]">
                Recent Sessions
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
