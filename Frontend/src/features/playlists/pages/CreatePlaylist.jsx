import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import {
  LuArrowLeft,
  LuPlus,
  LuImage,
  LuCheck
} from "react-icons/lu";
import { usePlaylists } from "../hook/usePlaylist.js";
import { useSongs } from "../../songs/hook/useSongs.js";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist, creating } = usePlaylists();
  const { songs, fetchSongs } = useSongs();

  const [title, setTitle] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleSongSelection = (songId) => {
    setSelectedSongIds((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a playlist title");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    if (selectedSongIds.length > 0) {
      formData.append("songs", JSON.stringify(selectedSongIds));
    }

    const res = await createPlaylist(formData);
    if (!res.error) {
      toast.success("Playlist created successfully!");
      navigate("/playlists");
    } else {
      toast.error(res.payload || "Failed to create playlist");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-8">
        
        {/* Back Link */}
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-white mb-6 transition-colors"
        >
          <LuArrowLeft size={16} />
          <span>Back to Playlists</span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl bg-[#16161a] border border-white/10 p-6 md:p-8 shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white mb-2 tracking-tight">
            Create Mood Playlist
          </h1>
          <p className="text-xs md:text-sm text-[#94a3b8] mb-8">
            Set up a new personalized soundtrack for any mood.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                Playlist Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Late Night Chill, Gym Energy, Rainy Melodies"
                required
                className="w-full rounded-xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#d62b70] focus:ring-1 focus:ring-[#d62b70] outline-none transition-all"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                Cover Thumbnail (Optional)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-2xl bg-[#1f1f22] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Playlist preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LuImage className="text-[#94a3b8]" size={28} />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="cover-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white cursor-pointer transition-colors"
                  >
                    <LuPlus size={14} />
                    <span>Choose Image</span>
                  </label>
                  <p className="text-[11px] text-[#94a3b8] mt-1">
                    Recommended: 500x500 square JPG or PNG
                  </p>
                </div>
              </div>
            </div>

            {/* Select Songs */}
            {songs.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Add Initial Songs ({selectedSongIds.length} selected)
                </label>
                <div className="max-h-60 overflow-y-auto rounded-2xl bg-[#131316] border border-white/5 p-2 flex flex-col gap-1">
                  {songs.map((song) => {
                    const isSelected = selectedSongIds.includes(song._id);
                    return (
                      <div
                        key={song._id}
                        onClick={() => toggleSongSelection(song._id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected ? "bg-[#d62b70]/15 border border-[#d62b70]/40" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={song.posterUrl}
                            alt={song.title}
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-white">
                              {song.title}
                            </p>
                            <p className="truncate text-[10.5px] text-[#94a3b8]">
                              {song.songArtist}
                            </p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "bg-[#d62b70] border-[#d62b70] text-white" : "border-white/20"
                        }`}>
                          {isSelected && <LuCheck size={12} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <Link
                to="/playlists"
                className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={creating}
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white text-xs md:text-sm font-bold shadow-[0_4px_20px_rgba(214,43,112,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {creating ? "Creating Playlist..." : "Create Playlist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
