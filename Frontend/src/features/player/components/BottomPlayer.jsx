import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  LuPlay,
  LuPause,
  LuSkipBack,
  LuSkipForward,
  LuShuffle,
  LuRepeat,
  LuRepeat1,
  LuVolume2,
  LuVolumeX,
  LuHeart,
  LuMaximize2
} from "react-icons/lu";
import { usePlayer } from "../hook/usePlayer.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";
import { useAuth } from "../../auth/hook/useAuth.js";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    togglePlay,
    playNext,
    playPrevious,
    setProgress,
    setDuration,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { isAuthenticated } = useAuth();
  const audioRef = useRef(null);
  const [isSeeking, setIsSeeking] = useState(false);

  // Sync audio source
  useEffect(() => {
    if (!audioRef.current || !currentSong?.songUrl) return;

    audioRef.current.src = currentSong.songUrl;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay blocked or interrupted:", err);
      });
    }
  }, [currentSong, isPlaying]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn(err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Sync volume & mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (!isSeeking && audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNext();
    }
  };

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
  };

  const handleSeekCommit = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setIsSeeking(false);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  const handleBookmarkToggle = () => {
    if (!isAuthenticated || !currentSong?._id) return;
    if (isBookmarked(currentSong._id)) {
      removeBookmark(currentSong._id);
    } else {
      addBookmark(currentSong._id);
    }
  };

  if (!currentSong) return null;

  const bookmarked = currentSong._id ? isBookmarked(currentSong._id) : false;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-[88px] md:h-[92px] bg-[#131316]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.7)] px-4 md:px-6">
      {/* Invisible HTML5 Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Track Information */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[180px] max-w-[280px]">
          <Link
            to={`/song/${currentSong._id}`}
            className="relative h-12 w-12 md:h-14 md:w-14 rounded-xl overflow-hidden shrink-0 group shadow-md border border-white/10"
          >
            <img
              src={currentSong.posterUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop"}
              alt={currentSong.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Live mood indicator dot */}
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#d62b70] shadow-[0_0_8px_#d62b70] animate-pulse" />
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              to={`/song/${currentSong._id}`}
              className="block truncate text-xs md:text-sm font-bold text-white hover:text-[#ffb1c4] transition-colors"
            >
              {currentSong.title}
            </Link>
            <p className="truncate text-[11px] md:text-xs text-[#94a3b8]">
              {currentSong.songArtist}
            </p>
            {currentSong.mood && (
              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full bg-[#d62b70]/15 text-[#ffb1c4] text-[9px] font-semibold uppercase tracking-wider">
                {currentSong.mood}
              </span>
            )}
          </div>

          {isAuthenticated && (
            <button
              onClick={handleBookmarkToggle}
              className="text-[#94a3b8] hover:text-[#d62b70] transition-colors shrink-0 p-1"
              aria-label="Bookmark song"
            >
              <LuHeart
                size={18}
                className={bookmarked ? "fill-[#d62b70] text-[#d62b70]" : ""}
              />
            </button>
          )}
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-[550px] gap-1.5">
          {/* Controls buttons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={toggleShuffle}
              className={`transition-colors text-xs p-1 ${
                shuffle ? "text-[#2bd6d6]" : "text-[#94a3b8] hover:text-white"
              }`}
              title={shuffle ? "Shuffle On" : "Shuffle Off"}
            >
              <LuShuffle size={15} />
            </button>

            <button
              onClick={playPrevious}
              className="text-[#94a3b8] hover:text-white transition-colors p-1"
              title="Previous"
            >
              <LuSkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white hover:bg-[#ffb1c4] text-[#0f0f12] flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <LuPause size={20} className="fill-current" /> : <LuPlay size={20} className="fill-current ml-0.5" />}
            </button>

            <button
              onClick={playNext}
              className="text-[#94a3b8] hover:text-white transition-colors p-1"
              title="Next"
            >
              <LuSkipForward size={18} />
            </button>

            <button
              onClick={cycleRepeat}
              className={`transition-colors text-xs p-1 ${
                repeat !== "off" ? "text-[#d62b70]" : "text-[#94a3b8] hover:text-white"
              }`}
              title={`Repeat: ${repeat}`}
            >
              {repeat === "one" ? <LuRepeat1 size={16} /> : <LuRepeat size={15} />}
            </button>
          </div>

          {/* Progress scrubber bar */}
          <div className="flex items-center gap-3 w-full text-[11px] text-[#94a3b8] font-medium">
            <span className="w-8 text-right shrink-0">{formatTime(progress)}</span>
            
            <div className="relative flex-1 flex items-center group h-4 cursor-pointer">
              {/* Background Track */}
              <div className="w-full h-1.5 bg-[#2a2a2d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d62b70] to-[#ffb1c4] rounded-full transition-all shadow-[0_0_10px_rgba(214,43,112,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Slider Input overlay */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress || 0}
                onMouseDown={() => setIsSeeking(true)}
                onTouchStart={() => setIsSeeking(true)}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <span className="w-8 shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Extra Controls */}
        <div className="hidden sm:flex items-center justify-end gap-4 w-1/4 min-w-[160px]">
          <Link
            to={`/song/${currentSong._id}`}
            className="text-[#94a3b8] hover:text-white transition-colors p-1"
            title="Song Details"
          >
            <LuMaximize2 size={16} />
          </Link>

          {/* Volume Control */}
          <div className="flex items-center gap-2 group">
            <button
              onClick={toggleMute}
              className="text-[#94a3b8] hover:text-white transition-colors p-1"
              aria-label="Toggle mute"
            >
              {isMuted || volume === 0 ? <LuVolumeX size={17} /> : <LuVolume2 size={17} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 md:w-20 h-1.5 bg-[#2a2a2d] rounded-full appearance-none accent-[#d62b70] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;
