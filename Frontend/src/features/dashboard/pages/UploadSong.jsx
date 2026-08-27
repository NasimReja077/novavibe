import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import {
  LuArrowLeft,
  LuUpload,
  LuMusic,
  LuImage,
  LuX,
} from "react-icons/lu";
import { useSongs } from "../../songs/hook/useSongs.js";
import { GENRE_OPTIONS, LANGUAGE_OPTIONS } from "../../songs/constants/genres.js";
import MultiSelectDropdown from "../../Shared/Components/MultiSelectDropdown.jsx";

const MOOD_OPTIONS = ["happy", "sad", "neutral", "surprised"];

const UploadSong = () => {
  const navigate = useNavigate();
  const { uploadSong, uploading } = useSongs();

  const [formData, setFormData] = useState({
    title: "",
    songArtist: "",
    mood: "happy",
    songLanguage: "english",
  });
  const [genres, setGenres] = useState([]);

  const [songFile, setSongFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [isPosterDragging, setIsPosterDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSongFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSongFile(file);
  };

  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handlePosterDrop = (e) => {
    e.preventDefault();
    setIsPosterDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const clearPoster = () => {
    setPosterFile(null);
    setPosterPreview("");
    setIsPosterDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.songArtist) {
      toast.error("Please fill in song title and artist");
      return;
    }
    if (!songFile) {
      toast.error("Please select an MP3 audio file");
      return;
    }
    if (genres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("songArtist", formData.songArtist);
    data.append("mood", formData.mood);
    data.append("songLanguage", formData.songLanguage);
    data.append("song", songFile);
    if (posterFile) {
      data.append("poster", posterFile);
    }
    genres.forEach((g) => data.append("genre", g));

    const res = await uploadSong(data);
    if (!res.error) {
      toast.success("Song uploaded successfully!");
      navigate("/dashboard");
    } else {
      toast.error(res.payload || "Failed to upload song");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-[#e4e1e6] pb-32">
      {/* subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-[#d62b70]/8 to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 md:px-8 py-10">
        {/* Back */}
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#94a3b8] hover:text-white mb-8 transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <LuArrowLeft size={15} />
          </span>
          Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="rounded-3xl bg-[#141417]/90 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 md:px-10 pt-8 pb-6 border-b border-white/5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d62b70]/25 to-[#8b5cf6]/20 border border-[#d62b70]/30 text-[#ffb1c4]">
                <LuUpload size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Upload New Song
                </h1>
                <p className="mt-1 text-sm text-[#94a3b8]">
                  Publish your track and tag it with real-time mood intelligence.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 md:px-10 py-8 space-y-7">
            {/* Title & Artist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Song Title <span className="text-[#d62b70]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Let Me Down Slowly"
                  required
                  className="w-full rounded-xl bg-[#1c1c20] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-[#64748b] focus:border-[#d62b70]/60 focus:ring-2 focus:ring-[#d62b70]/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Artist / Creator <span className="text-[#d62b70]">*</span>
                </label>
                <input
                  type="text"
                  name="songArtist"
                  value={formData.songArtist}
                  onChange={handleChange}
                  placeholder="e.g. Alec Benjamin"
                  required
                  className="w-full rounded-xl bg-[#1c1c20] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-[#64748b] focus:border-[#d62b70]/60 focus:ring-2 focus:ring-[#d62b70]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Mood & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Primary Mood Tag <span className="text-[#d62b70]">*</span>
                </label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl bg-[#1c1c20] border border-white/10 px-4 py-3.5 text-sm text-white capitalize cursor-pointer focus:border-[#d62b70]/60 focus:ring-2 focus:ring-[#d62b70]/20 outline-none transition-all"
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m} value={m} className="bg-[#16161a]">
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Song Language
                </label>
                <select
                  name="songLanguage"
                  value={formData.songLanguage}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl bg-[#1c1c20] border border-white/10 px-4 py-3.5 text-sm text-white capitalize cursor-pointer focus:border-[#d62b70]/60 focus:ring-2 focus:ring-[#d62b70]/20 outline-none transition-all"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang} className="bg-[#16161a]">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Genre */}
            <MultiSelectDropdown
              label="Genre(s) *"
              options={GENRE_OPTIONS}
              selected={genres}
              onChange={setGenres}
              placeholder="Select one or more genres"
            />

            {/* Audio Upload Zone */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                Audio File (MP3 / WAV / OGG) <span className="text-[#d62b70]">*</span>
              </label>

              <label className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-[#1c1c20]/60 px-6 py-8 cursor-pointer hover:border-[#d62b70]/40 hover:bg-[#1c1c20] transition-all">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleSongFileChange}
                  required
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d62b70]/15 text-[#ffb1c4] group-hover:scale-105 transition-transform">
                  <LuMusic size={22} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white">
                    {songFile ? "Change audio file" : "Click to upload audio"}
                  </p>
                  <p className="mt-1 text-xs text-[#64748b]">
                    MP3, WAV or OGG • Max recommended 50 MB
                  </p>
                </div>
              </label>

              {songFile && (
                <div className="flex items-center gap-3 rounded-xl bg-[#d62b70]/10 border border-[#d62b70]/20 px-4 py-3">
                  <LuMusic size={16} className="text-[#ffb1c4] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#ffb1c4] truncate">
                      {songFile.name}
                    </p>
                    <p className="text-[11px] text-[#94a3b8]">
                      {(songFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Poster Artwork */}
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                Poster Artwork (JPG / PNG)
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsPosterDragging(true);
                }}
                onDragLeave={() => setIsPosterDragging(false)}
                onDrop={handlePosterDrop}
                className={`relative overflow-hidden rounded-2xl border border-dashed p-4 transition-all ${
                  isPosterDragging
                    ? "border-[#d62b70] bg-[#d62b70]/10"
                    : "border-white/15 bg-[#1c1c20]/60 hover:border-[#d62b70]/50 hover:bg-[#1c1c20]"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterFileChange}
                  id="poster-upload"
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />

                <div className="flex items-center gap-4">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#121216] shadow-inner">
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Poster preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#64748b]">
                        <LuImage size={28} />
                        <span className="text-[10px] uppercase tracking-wider">Preview</span>
                      </div>
                    )}
                    {posterPreview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearPoster();
                        }}
                        className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition-colors hover:bg-[#d62b70]"
                        aria-label="Remove poster artwork"
                      >
                        <LuX size={14} />
                      </button>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <LuUpload size={16} className="text-[#ffb1c4]" />
                      <p className="text-sm font-semibold text-white">
                        {posterPreview ? "Artwork selected" : "Drop your artwork here"}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">
                      {posterFile?.name || "or click anywhere to browse from your device"}
                    </p>
                    <p className="mt-2 text-[11px] text-[#64748b]">
                      JPG or PNG · Square 500 × 500 or higher recommended
                    </p>
                    {posterFile && (
                      <p className="mt-1 text-[11px] text-[#ffb1c4]">
                        {(posterFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
              <Link
                to="/dashboard"
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={uploading}
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(214,43,112,0.35)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Uploading…
                  </span>
                ) : (
                  "Publish Track"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadSong;