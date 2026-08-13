import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Playlist title is required"],
      trim: true,
      maxlength: [120, "Playlist title cannot exceed 120 characters"],
    },
    thumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },
    thumbnailFileId: {
      type: String,
      default: "",
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "songs",
      },
    ],
    songCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Auto update songCount before saving

playlistSchema.pre("save", function () {
  this.songCount = this.songs?.length || 0;
});

// Auto update songCount on update operations

playlistSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function () {
  const update = this.getUpdate();

  if (update?.$set?.songs) {
    update.$set.songCount = update.$set.songs.length;
  } else if (update?.songs) {
    update.songCount = update.songs.length;
  }
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
