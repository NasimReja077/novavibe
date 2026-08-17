import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import {
  LuArrowLeft,
  LuUpload,
  LuMusic,
  LuImage
} from "react-icons/lu";
import { useSongs } from "../../songs/hook/useSongs.js";

const MOOD_OPTIONS = ["happy", "sad", "neutral", "surprised"];

const UploadSong = () => {
  const navigate = useNavigate();
  const { uploadSong, uploading } = useSongs();

  const [formData, setFormData] = useState({
    title: "",
    songArtist: "",
    mood: "happy",
    genre: "Pop",
    songLanguage: "english",
  });

  const [songFile, setSongFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");

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

    const data = new FormData();
    data.append("title", formData.title);
    data.append("songArtist", formData.songArtist);
    data.append("mood", formData.mood);
    data.append("songLanguage", formData.songLanguage);
    data.append("song", songFile);
    if (posterFile) {
      data.append("poster", posterFile);
    }

    const genresArray = formData.genre
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    genresArray.forEach((g) => data.append("genre", g));

    const res = await uploadSong(data);
    if (!res.error) {
      toast.success("Song uploaded successfully!");
      navigate("/dashboard");
    } else {
      toast.error(res.payload || "Failed to upload song");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-8">
        
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-white mb-6 transition-colors"
        >
          <LuArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Form Card */}
        <div className="rounded-3xl bg-[#16161a] border border-white/10 p-6 md:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#d62b70]/20 border border-[#d62b70]/40 flex items-center justify-center text-[#ffb1c4]">
              <LuUpload size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white tracking-tight">
                Upload New Song
              </h1>
              <p className="text-xs text-[#94a3b8]">
                Publish your track and tag it with real-time mood intelligence.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            
            {/* Title & Artist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Song Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Let Me Down Slowly"
                  required
                  className="w-full rounded-xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#d62b70] focus:ring-1 focus:ring-[#d62b70] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Artist / Creator *
                </label>
                <input
                  type="text"
                  name="songArtist"
                  value={formData.songArtist}
                  onChange={handleChange}
                  placeholder="e.g. Alec Benjamin"
                  required
                  className="w-full rounded-xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#d62b70] focus:ring-1 focus:ring-[#d62b70] outline-none transition-all"
                />
              </div>
            </div>

            {/* Mood & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Primary Mood Tag *
                </label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#d62b70] focus:ring-1 focus:ring-[#d62b70] outline-none capitalize"
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m} value={m} className="bg-[#16161a] text-white">
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Song Language
                </label>
                <input
                  type="text"
                  name="songLanguage"
                  value={formData.songLanguage}
                  onChange={handleChange}
                  placeholder="e.g. english, hindi, japanese"
                  className="w-full rounded-xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#d62b70] focus:ring-1 focus:ring-[#d62b70] outline-none transition-all"
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                Genre(s) (comma-separated)
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="e.g. Pop, Soft, Indie, Acoustic"
                className="w-full rounded-xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#d62b70] focus:ring-1 focus:ring-[#d62b70] outline-none transition-all"
              />
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                Audio File (MP3 / WAV / OGG) *
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleSongFileChange}
                required
                className="w-full rounded-xl bg-[#1f1f22] border border-dashed border-white/20 p-3 text-xs text-[#94a3b8] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#d62b70] file:text-white hover:file:brightness-110 cursor-pointer"
              />
              {songFile && (
                <p className="text-[11px] text-[#ffb1c4] mt-1.5 flex items-center gap-1">
                  <LuMusic size={12} />
                  <span>Selected: {songFile.name} ({(songFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </p>
              )}
            </div>

            {/* Poster Artwork Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                Poster Artwork (JPG / PNG)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-[#1f1f22] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  {posterPreview ? (
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LuImage className="text-[#94a3b8]" size={24} />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterFileChange}
                    id="poster-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="poster-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white cursor-pointer transition-colors"
                  >
                    <LuImage size={14} />
                    <span>Select Artwork</span>
                  </label>
                  <p className="text-[11px] text-[#94a3b8] mt-1">
                    Square 500x500 or higher recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white text-xs md:text-sm font-bold shadow-[0_4px_25px_rgba(214,43,112,0.45)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {uploading ? "Uploading Audio Track..." : "Publish Track"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadSong;
