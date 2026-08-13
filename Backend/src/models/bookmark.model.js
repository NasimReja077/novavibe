import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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

bookmarkSchema.index({ userId: 1, songId: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
