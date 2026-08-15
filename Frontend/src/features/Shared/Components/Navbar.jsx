import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { LuSearch, LuUser, LuLogOut, LuMenu, LuX } from "react-icons/lu";
import { useAuth } from "../../auth/hook/useAuth.js";

const navLinks = [{ label: "Home", to: "/" }];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      toast.success("Logged out", { id: "logout-success" });
    }
    navigate("/login");
  };

  const initial = (user?.username || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05080f]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-['Bebas_Neue'] text-2xl tracking-[0.06em] text-[#dde8ff]">
            NovaVibe
          </span>
          <span className="rounded-md border border-[rgba(61,139,255,0.25)] bg-[rgba(61,139,255,0.10)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3d8bff]">
            AI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#dde8ff]"
                    : "text-[#5a7ab0] hover:text-[#dde8ff]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 rounded-xl border border-[rgba(61,139,255,0.16)] bg-[rgba(4,8,20,0.92)] px-3 py-2 focus-within:border-[#3d8bff] transition-colors duration-200">
          <LuSearch size={15} className="text-[#5a7ab0] shrink-0" />
          <input
            type="text"
            placeholder="Search songs, artists..."
            className="w-full bg-transparent text-[13px] text-[#dde8ff] placeholder:text-[#1e3356] outline-none"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3d8bff] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(61,139,255,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
                aria-label="Account menu"
              >
                {initial}
              </button>

              {menuOpen && (
                <ul className="absolute right-0 mt-3 w-52 overflow-hidden rounded-xl border border-[rgba(61,139,255,0.16)] bg-[rgba(8,13,26,0.98)] p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
                  <li className="px-3 py-2 text-[12px] text-[#5a7ab0]">
                    Signed in as{" "}
                    <span className="text-[#dde8ff] font-medium">
                      {user?.username || user?.email}
                    </span>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#dde8ff] transition-colors duration-150 hover:bg-[rgba(61,139,255,0.10)]"
                    >
                      <LuUser size={15} />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 transition-colors duration-150 hover:bg-red-500/10"
                    >
                      <LuLogOut size={15} />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#5a7ab0] transition-colors duration-200 hover:text-[#dde8ff]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#3d8bff] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(61,139,255,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5aa3ff]"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#5a7ab0] transition-colors duration-200 hover:text-[#dde8ff] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#05080f] px-4 py-4 md:hidden">
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-[rgba(61,139,255,0.16)] bg-[rgba(4,8,20,0.92)] px-3 py-2">
            <LuSearch size={15} className="text-[#5a7ab0] shrink-0" />
            <input
              type="text"
              placeholder="Search songs, artists..."
              className="w-full bg-transparent text-[13px] text-[#dde8ff] placeholder:text-[#1e3356] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "text-[#dde8ff]" : "text-[#5a7ab0]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {!isAuthenticated && (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-center text-sm font-medium text-[#dde8ff]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[#3d8bff] px-3 py-2 text-center text-sm font-semibold text-white"
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