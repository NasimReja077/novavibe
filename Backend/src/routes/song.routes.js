import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { uploadSongFiles } from "../middlewares/upload.middleware.js";
import { createSongValidator, validate } from "../validator/song.validator.js";
import {
  createSong,
  deleteSong,
  getAllSongs,
  getAllSongsByUser,
  getSongById,
} from "../controllers/song.controller.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  uploadSongFiles,
  createSongValidator,
  validate,
  createSong,
);

router.get("/", getAllSongs);
router.delete("/:id", authenticateUser, deleteSong);
router.get("/:id", getSongById);
router.get("/user/:userId", authenticateUser, getAllSongsByUser);

export default router;