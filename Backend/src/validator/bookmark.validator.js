import { body, param, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

export const validateCreateBookmark = [
  body("songId")
    .trim()
    .notEmpty()
    .withMessage("Song ID is required")
    .isMongoId()
    .withMessage("Invalid song ID"),
  validateRequest,
];

export const validateRemoveBookmark = [
  param("songId")
    .trim()
    .notEmpty()
    .withMessage("Song ID is required")
    .isMongoId()
    .withMessage("Invalid song ID"),
  validateRequest,
];
