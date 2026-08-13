import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateCreateBookmark, validateRemoveBookmark } from "../validator/bookmark.validator.js";
import { getMyBookmarks, addBookmark, removeBookmark } from "../controllers/bookmark.controller.js";

const router = Router();

router.get("/", authenticateUser, getMyBookmarks);
router.post("/", authenticateUser, validateCreateBookmark, addBookmark);
router.delete("/:songId", authenticateUser, validateRemoveBookmark, removeBookmark);

export default router;
