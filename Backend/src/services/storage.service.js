import ImageKit, { toFile } from "@imagekit/nodejs";
import NodeID3 from "node-id3";
import imagekit from "../config/imagekit.js";

/**
 * Upload a single file (image or audio) to ImageKit
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalName - Original filename
 * @param {string} folder - Folder in ImageKit (e.g. "posters", "songs")
 * @param {string[]} tags - Optional tags
 */

export const uploadToImageKit = async (
  fileBuffer,
  originalName,
  folder = "uploads",
  tags = [],
) => {
  try {
    const file = await toFile(fileBuffer, originalName);
    const response = await imagekit.files.upload({
      file,
      fileName: originalName,
      folder: `/${folder}`,
      tags,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      thumbnailUrl: response.thumbnailUrl || null,
    };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error(error.message || "Failed to upload file to ImageKit");
  }
};

/**
 * Read metadata from uploaded MP3 using node-id3
 */
export const readSongMetadata = (songFile) => {
  try {
    if (!songFile?.buffer) {
      return {};
    }

    const tags = NodeID3.read(songFile.buffer);

    return {
      title: tags.title?.trim() || songFile.originalname.replace(/\.[^/.]+$/, "") || "Untitled Song",
      songArtist: tags.artist?.trim() || "Unknown Artist",
      genre: tags.genre?.trim() || "Pop",
      album: tags.album?.trim() || "",
      artwork: tags.image || null,
    };
  } catch (error) {
    console.warn("NodeID3 metadata read failed:", error.message);
    return {
      title: songFile?.originalname?.replace(/\.[^/.]+$/, "") || "Untitled Song",
      songArtist: "Unknown Artist",
      genre: "Pop",
      album: "",
      artwork: null,
    };
  }
};

/**
 * Upload both poster + song together
 */
export const uploadSongFiles = async (posterFile, songFile) => {
  const [posterResult, songResult] = await Promise.all([
    uploadToImageKit(posterFile.buffer, posterFile.originalname, "posters", [
      "poster",
      "music",
    ]),
    uploadToImageKit(songFile.buffer, songFile.originalname, "songs", [
      "audio",
      "music",
    ]),
  ]);

  return {
    posterUrl: posterResult.url,
    posterFileId: posterResult.fileId,
    songUrl: songResult.url,
    songFileId: songResult.fileId,
  };
};

/**
 * Delete file from ImageKit (optional - useful for cleanup)
 */

export const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.files.delete(fileId);
    return true;
  } catch (error) {
    console.error("ImageKit Delete Error:", error);
    return false;
  }
};
