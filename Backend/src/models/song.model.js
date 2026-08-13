const mongoose = require("mongoose");

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
      maxlength: 100,
    },

    songUrl: {
      type: String,
      required: [true, "Song url is required"],
    },
    songFileId: {
      type: String, // ImageKit fileId (useful for deletion)
    },
    // Poster / Cover
    posterUrl: {
      type: String,
      required: [true, "Poster URL is required"],
    },
    posterFileId: {
      type: String,
    },

    mood: {
      type: String,
      required: true,
      enum: {
        values: ["happy", "sad", "surprised", "neutral", "angry"],
        message: "{VALUE} is not a supported mood",
      },
      index: true, // Important for fast filtering
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    genre: {
      type: String,
      enum: [
        "Pop",
        "Rock",
        "Hip-Hop",
        "Classical",
        "Jazz",
        "Electronic",
        "R&B",
        "Country",
        "Blues",
        "Metal",
      ],
      required: true,
    },

    language: {
      type: String,
      default: "english",
      lowercase: true,
      // enum : {
      //     values : ["english","Hindie","bengole"],
      //     message : ['language can be only english,hindie or bengole']
      // }
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "uploader userId is required"],
    },
    isActive: {
      type: Boolean,
      default: true, // Soft delete support
    },
  },
  { timestamps: true },
);

// Indexes for performance
songSchema.index({ mood: 1 }); // Most popular songs per mood
songSchema.index({ title: "text", songArtist: "text", genre: "text" }); // Text search
songSchema.index({ isActive: 1, mood: 1 });

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;
