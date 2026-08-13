import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateRecentlyPlayedSong } from "../validator/recentlyPlayedSong.validator.js";
import {
  addRecentlyPlayedSong,
  getRecentlyPlayedSongs,
  clearRecentlyPlayedSongs,
} from "../controllers/recentlyPlayedSong.controller.js";

const router = Router();

router.get("/", authenticateUser, getRecentlyPlayedSongs);
router.post("/", authenticateUser, validateRecentlyPlayedSong, addRecentlyPlayedSong);
router.delete("/clear", authenticateUser, clearRecentlyPlayedSongs);

export default router;
