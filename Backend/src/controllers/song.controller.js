import Song from "../models/song.model.js";
import { uploadSongFiles, readSongMetadata } from "../services/storage.service.js";

const normalizeGenres = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const createSong = async (req, res) => {
  try {
    if (!req.files?.poster?.[0] || !req.files?.song?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Both poster image and song file are required",
      });
    }

    const { title, songArtist, mood, genre, songLanguage, language } = req.body;
    const posterFile = req.files.poster[0];
    const songFile = req.files.song[0];
    const songMeta = readSongMetadata(songFile);

    const finalTitle = title?.trim() || songMeta.title;
    const finalArtist = songArtist?.trim() || songMeta.songArtist;
    const normalizedGenres = normalizeGenres(genre);
    const finalGenre = normalizedGenres.length ? normalizedGenres : [songMeta.genre].filter(Boolean);
    const finalSongLanguage = songLanguage || language || "english";

    const { posterUrl, songUrl, posterFileId, songFileId } = await uploadSongFiles(
      posterFile,
      songFile,
    );

    const newSong = await Song.create({
      title: finalTitle,
      songArtist: finalArtist,
      mood: mood || "neutral",
      genre: finalGenre,
      songLanguage: finalSongLanguage,
      posterUrl,
      posterFileId,
      songUrl,
      songFileId,
      uploadedBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      data: newSong,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while uploading song",
    });
  }
};

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isActive: true })
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error("Error in getAllSongs:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id).populate("uploadedBy", "username email");

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("Error in getSongById:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllSongsByUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const songs = await Song.find({ uploadedBy: userId, isActive: true })
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error("Error in getAllSongsByUser:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};