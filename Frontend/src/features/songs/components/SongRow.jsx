import { LuPlay, LuPause, LuHeart } from "react-icons/lu";

const moodColors = {
  happy: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  sad: "text-sky-300 border-sky-300/30 bg-sky-300/10",
  surprised: "text-pink-300 border-pink-300/30 bg-pink-300/10",
  neutral: "text-slate-300 border-slate-300/30 bg-slate-300/10",
  angry: "text-red-300 border-red-300/30 bg-red-300/10",
};

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
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
}) => {
  return (
    <div
      className={`group flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors duration-150 ${
        isActive ? "bg-[rgba(61,139,255,0.10)]" : "hover:bg-white/3"
      }`}
    >
      <span className="w-5 shrink-0 text-center text-[13px] text-[#5a7ab0]">
        {isActive ? (
          <span className="text-[#3d8bff]">
            {isPlaying ? "▶" : "❚❚"}
          </span>
        ) : (
          index + 1
        )}
      </span>

      <button
        onClick={() => onPlay(song)}
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg"
        aria-label={`Play ${song.title}`}
      >
        <img
          src={song.posterUrl}
          alt={song.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {isActive && isPlaying ? (
            <LuPause size={16} className="text-white" />
          ) : (
            <LuPlay size={16} className="text-white" />
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-[#dde8ff]">
          {song.title}
        </p>
        <p className="truncate text-[12px] text-[#5a7ab0]">
          {song.songArtist}
        </p>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        {song.mood && (
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
              moodColors[song.mood] || moodColors.neutral
            }`}
          >
            {song.mood}
          </span>
        )}
        {song.genre?.[0] && (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-[#5a7ab0]">
            {song.genre[0]}
          </span>
        )}
      </div>

      <span className="w-10 shrink-0 text-right text-[12px] text-[#5a7ab0]">
        {formatDuration(song.durationSeconds)}
      </span>

      {onToggleBookmark && (
        <button
          onClick={() => onToggleBookmark(song._id)}
          className="shrink-0 text-[#5a7ab0] transition-colors duration-150 hover:text-pink-400"
          aria-label="Toggle bookmark"
        >
          <LuHeart
            size={16}
            className={isBookmarked ? "fill-pink-400 text-pink-400" : ""}
          />
        </button>
      )}
    </div>
  );
};

export default SongRow;