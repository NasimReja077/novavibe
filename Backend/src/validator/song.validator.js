import { body, validationResult } from "express-validator";

const allowedMoods = ["sad", "happy", "surprised", "neutral", "angry"];
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
  "Soft"
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

export const createSongValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("songArtist")
    .trim()
    .notEmpty()
    .withMessage("Artist name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Artist name must be between 2 and 100 characters"),

  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre is required")
    .isIn(allowedGenres)
    .withMessage(`Genre must be one of: ${allowedGenres.join(", ")}`),

  body("mood")
    .optional({ nullable: true })
    .trim()
    .toLowerCase()
    .isIn(allowedMoods)
    .withMessage(`Mood must be one of: ${allowedMoods.join(", ")}`),

  body("songLanguage")
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Song language must be between 2 and 50 characters"),

  body("language")
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Language must be between 2 and 50 characters"),

  (req, res, next) => {
    if (!req.files || !req.files.poster || !req.files.poster.length || !req.files.song || !req.files.song.length) {
      return res.status(400).json({
        success: false,
        message: "Both poster image and song file are required",
      });
    }

    next();
  },
];