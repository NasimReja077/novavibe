import mongoose from "mongoose";

const allowedGenres = [
  "Pop",
  "Lo-Fi",
  "Rock",
  "Hip-Hop",
  "chillout",
  "Neo-Soul",
  "Classical",
  "Folk",
  "Indie",
  "Electronic",
  "Punk",
  "K-pop",
  "Heavy-Metal",
  "J-pop",
  "Bollywood",
  "Country",
  "Blues",
  "Metal",
  "Soundtrack",
  "Disco",
  "Soft",
];

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Song title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    songArtist: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
      maxlength: [100, "Artist name cannot exceed 100 characters"],
    },
    songUrl: {
      type: String,
      required: [true, "Song URL is required"],
      trim: true,
    },
    songFileId: {
      type: String,
    },
    posterUrl: {
      type: String,
      required: [true, "Poster URL is required"],
      trim: true,
    },
    posterFileId: {
      type: String,
    },
    mood: {
      type: String,
      lowercase: true,
      trim: true,
      default: "neutral",
      enum: {
        values: ["happy", "sad", "surprised", "neutral", "angry"],
        message: "{VALUE} is not a supported mood",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    genre: {
      type: [
        {
          type: String,
          enum: allowedGenres,
        },
      ],
      required: [true, "At least one genre is required"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one genre is required",
      },
    },
    songLanguage: {
      type: String,
      default: "english",
      lowercase: true,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Uploader user ID is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

songSchema.index({ title: "text", songArtist: "text", genre: "text" });
songSchema.index({ isActive: 1, mood: 1 });

const Song = mongoose.model("songs", songSchema);

export default Song;