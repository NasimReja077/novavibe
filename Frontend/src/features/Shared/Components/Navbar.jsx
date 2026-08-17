import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  LuSearch,
  LuUser,
  LuLogOut,
  LuMenu,
  LuX,
  LuSparkles,
  LuMusic,
  LuHeart,
  LuClock,
  LuLayoutDashboard,
  // LuPlusCircle
} from "react-icons/lu";
import { AiTwotonePlusCircle } from "react-icons/ai";
import { useAuth } from "../../auth/hook/useAuth.js";

const navLinks = [
  { label: "Home", to: "/", icon: LuMusic },
  { label: "Playlists", to: "/playlists", icon: LuSparkles },
  { label: "Bookmarks", to: "/bookmarks", icon: LuHeart },
  { label: "Recent", to: "/recently-played", icon: LuClock },
  { label: "Dashboard", to: "/dashboard", icon: LuLayoutDashboard },
];

const Navbar = ({ onSearchChange, searchTerm = "" }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    const resultAction = await logout();

    if (resultAction?.meta?.requestStatus === "fulfilled") {
      toast.success("Logged out successfully", { id: "logout-success" });
    }
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
  };

  const initial = (user?.username || user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0f0f12]/90 backdrop-blur-xl transition-all duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        
        {/* Brand Logo with Text Design */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#d62b70]/20 to-[#2bd6d6]/20 border border-[#d62b70]/30 group-hover:border-[#d62b70] transition-colors">
            <span className="font-['Bebas_Neue'] text-xl tracking-wider text-[#ffb1c4] group-hover:text-white transition-colors">
              NV
            </span>
            <div className="absolute -bottom-0.5 w-4 h-0.5 bg-[#d62b70] rounded-full shadow-[0_0_8px_#d62b70]" />
          </div>
          
          <div className="flex items-baseline gap-1.5">
            <span className="font-['Montserrat'] font-black text-xl md:text-2xl tracking-tight bg-gradient-to-r from-white via-[#e4e1e6] to-[#ffb1c4] bg-clip-text text-transparent group-hover:from-white group-hover:to-[#2bd6d6] transition-all">
              NovaVibe
            </span>
            <span className="rounded-full bg-[#d62b70]/15 border border-[#d62b70]/30 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-widest text-[#ffb1c4]">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[#1f1f22] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 text-[#ffb1c4]"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#1a1a1e]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={15} className={isActive ? "text-[#d62b70]" : "text-[#94a3b8]"} />
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#d62b70] rounded-full shadow-[0_0_8px_#d62b70]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center gap-2.5 rounded-full border border-white/10 bg-[#16161a]/90 px-3.5 py-1.5 focus-within:border-[#d62b70]/60 focus-within:ring-1 focus-within:ring-[#d62b70]/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
          >
            <LuSearch size={15} className="text-[#94a3b8] shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Search songs, artists, vibes..."
              className="w-full bg-transparent text-[13px] text-white placeholder:text-[#94a3b8]/60 outline-none"
            />
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/upload-song"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d62b70]/15 hover:bg-[#d62b70]/25 border border-[#d62b70]/40 text-[#ffb1c4] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-105"
            >
              <AiTwotonePlusCircle size={14} />
              <span>Upload Song</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 rounded-full bg-[#1b1b1e] border border-white/10 hover:border-[#d62b70]/50 transition-all hover:scale-105"
                aria-label="Account menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d62b70] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white shadow-[0_2px_10px_rgba(214,43,112,0.4)]">
                  {initial}
                </div>
                <span className="hidden md:block text-xs font-medium text-[#e4e1e6] pr-2">
                  {user?.username || "Account"}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#16161a]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-3 py-2.5 border-b border-white/5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                      Signed in as
                    </p>
                    <p className="truncate text-xs font-bold text-white mt-0.5">
                      {user?.username || user?.email}
                    </p>
                  </div>

                  <div className="py-1 flex flex-col gap-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#e4e1e6] hover:bg-white/5 hover:text-[#ffb1c4] transition-colors"
                    >
                      <LuUser size={14} />
                      User Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#e4e1e6] hover:bg-white/5 hover:text-[#ffb1c4] transition-colors"
                    >
                      <LuLayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <Link
                      to="/playlists"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#e4e1e6] hover:bg-white/5 hover:text-[#ffb1c4] transition-colors"
                    >
                      <LuSparkles size={14} />
                      My Playlists
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#e4e1e6] hover:bg-white/5 hover:text-[#ffb1c4] transition-colors"
                    >
                      <LuHeart size={14} />
                      Bookmarks
                    </Link>
                    <Link
                      to="/recently-played"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#e4e1e6] hover:bg-white/5 hover:text-[#ffb1c4] transition-colors"
                    >
                      <LuClock size={14} />
                      Recently Played
                    </Link>
                  </div>

                  <div className="border-t border-white/5 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LuLogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-4 py-1.5 text-xs font-semibold text-[#e4e1e6] hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_2px_15px_rgba(214,43,112,0.4)] hover:brightness-110 transition-all duration-200 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#16161a] text-[#94a3b8] hover:text-white lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <LuX size={18} /> : <LuMenu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Panel */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#0f0f12]/98 px-4 py-5 lg:hidden animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#16161a] px-4 py-2">
            <LuSearch size={16} className="text-[#94a3b8] shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Search songs, artists, vibes..."
              className="w-full bg-transparent text-sm text-white placeholder:text-[#94a3b8]/60 outline-none"
            />
          </form>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#1f1f22] text-[#ffb1c4] font-semibold"
                        : "text-[#94a3b8] hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <Icon size={17} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            {isAuthenticated && (
              <NavLink
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#94a3b8] hover:text-white hover:bg-white/5"
              >
                <LuUser size={17} />
                <span>My Profile</span>
              </NavLink>
            )}

            {!isAuthenticated && (
              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;