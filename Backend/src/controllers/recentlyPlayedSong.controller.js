import RecentlyPlayedSong from "../models/recentlyPlayedSong.model.js";

export const addRecentlyPlayedSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!songId) {
      return res.status(400).json({
        success: false,
        message: "Song ID is required",
      });
    }

    const record = await RecentlyPlayedSong.findOneAndUpdate(
      { userId, songId },
      { $set: { userId, songId } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    const history = await RecentlyPlayedSong.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("songId");

    return res.status(201).json({
      success: true,
      message: "Song added to recently played",
      data: history,
      latest: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update recently played songs",
    });
  }
};

export const getRecentlyPlayedSongs = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const songs = await RecentlyPlayedSong.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("songId");

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recently played songs",
    });
  }
};

export const clearRecentlyPlayedSongs = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await RecentlyPlayedSong.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Recently played songs cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear recently played songs",
    });
  }
};
