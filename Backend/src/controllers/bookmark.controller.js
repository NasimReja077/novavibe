import Bookmark from "../models/bookmark.model.js";

export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate("songId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookmarks",
    });
  }
};

export const addBookmark = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user._id;

    const existingBookmark = await Bookmark.findOne({ userId, songId });

    if (existingBookmark) {
      return res.status(409).json({
        success: false,
        message: "Song is already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({ userId, songId });

    return res.status(201).json({
      success: true,
      message: "Song bookmarked successfully",
      data: bookmark,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to bookmark song",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user._id;

    const deleted = await Bookmark.findOneAndDelete({ userId, songId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove bookmark",
    });
  }
};
