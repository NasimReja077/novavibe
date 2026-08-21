import { Link } from "react-router";
import { LuPlay, LuPause, LuHeart, LuInfo, LuTrash2 } from "react-icons/lu";

const moodBadgeStyles = {
  happy: "bg-[#d62b70]/15 text-[#ffb1c4] border-[#d62b70]/30",
  sad: "bg-[#2bd6d6]/15 text-[#2bd6d6] border-[#2bd6d6]/30",
  neutral: "bg-[#8b5cf6]/15 text-[#d0bcff] border-[#8b5cf6]/30",
  surprised: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return "3:30";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const SongRow = ({
  song,
  index,
  isActive,
  isPlaying,
  isBookmarked,
  onPlay,
  onToggleBookmark,
  onDelete,
}) => {
  return (
    <div
      className={`group flex items-center gap-3.5 md:gap-4 p-2.5 md:p-3 rounded-2xl transition-all duration-200 border ${
        isActive
          ? "bg-[#1f1f22]/90 border-[#d62b70]/40 shadow-[0_0_20px_rgba(214,43,112,0.15)] ring-1 ring-[#d62b70]/30"
          : "bg-[#16161a]/40 border-white/5 hover:bg-[#1f1f22]/60 hover:border-white/10"
      }`}
    >
      {/* Index Number or Live Equalizer */}
      <div className="w-6 md:w-8 shrink-0 flex items-center justify-center text-xs font-semibold text-[#94a3b8]">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <div className="w-0.5 bg-[#d62b70] h-full animate-eq-1 rounded-full" />
            <div className="w-0.5 bg-[#d62b70] h-full animate-eq-2 rounded-full" />
            <div className="w-0.5 bg-[#d62b70] h-full animate-eq-3 rounded-full" />
          </div>
        ) : (
          <span className="group-hover:hidden">{index + 1}</span>
        )}
        <button
          onClick={() => onPlay(song)}
          className="hidden group-hover:flex items-center justify-center text-[#ffb1c4] hover:scale-110 transition-transform"
          aria-label={`Play ${song.title}`}
        >
          {isActive && isPlaying ? <LuPause size={15} /> : <LuPlay size={15} />}
        </button>
      </div>

      {/* Thumbnail */}
      <div className="relative h-11 w-11 md:h-12 md:w-12 shrink-0 rounded-xl overflow-hidden shadow-md border border-white/10">
        <img
          src={song.posterUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop"}
          alt={song.title}
          className="h-full w-full object-cover"
        />
        <button
          onClick={() => onPlay(song)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white"
        >
          {isActive && isPlaying ? <LuPause size={16} /> : <LuPlay size={16} />}
        </button>
      </div>

      {/* Song Title & Artist */}
      <div className="min-w-0 flex-1">
        <Link
          to={`/song/${song._id}`}
          className={`block truncate text-xs md:text-sm font-bold transition-colors ${
            isActive ? "text-[#ffb1c4]" : "text-white group-hover:text-[#ffb1c4]"
          }`}
        >
          {song.title}
        </Link>
        <p className="truncate text-[11px] md:text-xs text-[#94a3b8] mt-0.5">
          {song.songArtist}
        </p>
      </div>

      {/* Mood & Genre Badges */}
      <div className="hidden sm:flex shrink-0 items-center gap-1.5">
        {song.mood && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              moodBadgeStyles[song.mood] || "bg-white/5 text-white/70 border-white/10"
            }`}
          >
            {song.mood}
          </span>
        )}
        {song.genre?.[0] && (
          <span className="rounded-full border border-white/10 bg-[#2a2a2d]/60 px-2.5 py-0.5 text-[10px] font-medium text-[#94a3b8]">
            {song.genre[0]}
          </span>
        )}
      </div>

      {/* Duration */}
      <span className="hidden md:block w-12 shrink-0 text-right text-xs text-[#94a3b8]">
        {formatDuration(song.durationSeconds)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/song/${song._id}`}
          className="text-[#94a3b8] hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100"
          title="Details"
        >
          <LuInfo size={16} />
        </Link>

        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(song._id)}
            className="text-[#94a3b8] hover:text-[#d62b70] transition-colors p-1"
            aria-label="Bookmark"
          >
            <LuHeart
              size={16}
              className={isBookmarked ? "fill-[#d62b70] text-[#d62b70]" : ""}
            />
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(song)}
            className="text-[#94a3b8] hover:text-red-400 transition-colors p-1"
            aria-label={`Delete ${song.title}`}
            title="Delete song"
          >
            <LuTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SongRow;