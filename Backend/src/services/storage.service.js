import ImageKit, { toFile } from "@imagekit/nodejs";
import imagekit from "../config/imagekit";

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

export default { uploadFile };
