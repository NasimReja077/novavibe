import mongoose from "mongoose";

const recentlyPlayedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
      index: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "songs",
      required: [true, "Song ID is required"],
      index: true,
    },
  },
  { timestamps: true },
);

recentlyPlayedSchema.index({ userId: 1, createdAt: -1 });

const RecentlyPlayedSong = mongoose.model("recentlyplayed", recentlyPlayedSchema);

export default RecentlyPlayedSong;

