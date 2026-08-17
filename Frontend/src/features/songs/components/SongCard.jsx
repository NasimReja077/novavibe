import { Link } from "react-router";
import { LuPlay, LuPause } from "react-icons/lu";

const moodBadgeStyles = {
  happy: "bg-[#d62b70]/20 text-[#ffb1c4] border-[#d62b70]/40",
  sad: "bg-[#2bd6d6]/20 text-[#2bd6d6] border-[#2bd6d6]/40",
  neutral: "bg-[#8b5cf6]/20 text-[#d0bcff] border-[#8b5cf6]/40",
  surprised: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

const SongCard = ({ song, rank, isActive, isPlaying, onPlay }) => {
  return (
    <div className="group relative flex-shrink-0 w-44 md:w-48 text-left transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#1a1a1e] border border-white/5 shadow-lg group-hover:border-white/20 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <img
          src={song.posterUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop"}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors backdrop-blur-[1px] group-hover:backdrop-blur-none" />

        {/* Mood Tag Top Left */}
        {song.mood && (
          <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md backdrop-blur-md border text-[10px] font-bold uppercase tracking-wider ${moodBadgeStyles[song.mood] || "bg-white/10 text-white border-white/20"}`}>
            {song.mood}
          </div>
        )}

        {/* Rank Badge Top Right or Bottom Right */}
        {rank && (
          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <span className="text-[11px] font-bold text-white">#{rank}</span>
          </div>
        )}

        {/* Play Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onPlay(song)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(214,43,112,0.6)] hover:scale-110 transition-transform duration-200"
            aria-label={`Play ${song.title}`}
          >
            {isActive && isPlaying ? (
              <LuPause size={18} />
            ) : (
              <LuPlay size={18} className="ml-0.5" />
            )}
          </button>
        </div>

        {/* Active Border Glow */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl ring-2 ring-[#d62b70] shadow-[inset_0_0_15px_rgba(214,43,112,0.4)]" />
        )}
      </div>

      {/* Meta text */}
      <div className="mt-2.5 px-1">
        <Link
          to={`/song/${song._id}`}
          className="block truncate text-[13.5px] font-bold text-[#e4e1e6] group-hover:text-[#ffb1c4] transition-colors"
        >
          {song.title}
        </Link>
        <p className="truncate text-[11.5px] text-[#94a3b8] mt-0.5">
          {song.songArtist}
        </p>
      </div>
    </div>
  );
};

export default SongCard;