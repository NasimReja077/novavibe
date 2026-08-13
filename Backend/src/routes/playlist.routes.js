import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { uploadPlaylistThumbnail } from "../middlewares/upload.middleware.js";
import {
  createPlaylistSongs,
  getAllPlaylistSongs,
  getPlaylistSongById,
} from "../controllers/playlist.controller.js";

const router = Router();

router.post("/", authenticateUser, uploadPlaylistThumbnail, createPlaylistSongs);
router.get("/", getAllPlaylistSongs);
router.get("/:id", getPlaylistSongById);

export default router;
