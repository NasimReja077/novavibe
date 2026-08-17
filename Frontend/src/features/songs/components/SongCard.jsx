import { LuPlay } from "react-icons/lu";

const SongCard = ({ song, rank, isActive, onPlay }) => {
  return (
    <button
      onClick={() => onPlay(song)}
      className="group text-left"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src={song.posterUrl}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {rank && (
          <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            #{rank}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3d8bff] text-white shadow-lg">
            <LuPlay size={14} />
          </span>
        </span>
        {isActive && (
          <span className="absolute inset-0 ring-2 ring-[#3d8bff] rounded-xl" />
        )}
      </div>
      <p className="mt-2 truncate text-[13px] font-medium text-[#dde8ff]">
        {song.title}
      </p>
      <p className="truncate text-[11.5px] text-[#5a7ab0]">
        {song.songArtist}
      </p>
    </button>
  );
};

export default SongCard;