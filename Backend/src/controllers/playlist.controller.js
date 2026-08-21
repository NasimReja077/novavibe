import Playlist from "../models/playlist.model.js";
import { deleteFromImageKit, uploadToImageKit } from "../services/storage.service.js";

export const createPlaylistSongs = async (req, res) => {
  try {
    const { title } = req.body;
    let { songs = [] } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist title is required",
      });
    }

    // Handle songs coming as string from form-data
    if (typeof songs === "string") {
      try {
        songs = JSON.parse(songs);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid songs format. Send a valid JSON array of song IDs.",
        });
      }
    }

    // Ensure songs is always an array
    if (!Array.isArray(songs)) {
      songs = [];
    }

    let thumbnailUrl = "";
    let thumbnailFileId = "";

    if (req.file) {
      const uploadResult = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname || `${title.trim()}-thumbnail.jpg`,
        "playlists",
        ["playlist", "thumbnail"],
      );

      thumbnailUrl = uploadResult.url;
      thumbnailFileId = uploadResult.fileId;
    }

    const playlist = await Playlist.create({
      title: title.trim(),
      songs,
      thumbnailUrl,
      thumbnailFileId,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      data: playlist,
    });
  } catch (error) {
    console.error("Error in createPlaylistSongs:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create playlist",
    });
  }
};

export const getAllPlaylistSongs = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isActive: true })
      .populate("songs")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists,
    });
  } catch (error) {
    console.error("Error in getAllPlaylistSongs:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch playlists",
    });
  }
};

export const getPlaylistSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error("Error in getPlaylistSongById:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch playlist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findOne({ _id: id, isActive: true });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    playlist.isActive = false;
    await playlist.save();

    if (playlist.thumbnailFileId) {
      await deleteFromImageKit(playlist.thumbnailFileId);
    }

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePlaylist:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete playlist",
    });
  }
};

