import { body, validationResult } from 'express-validator';


// Helper to handle validation errors
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
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),

  body('mood')
    .optional()
    .isIn(['sad', 'happy', 'surprised', 'Neutral'])
    .withMessage('Mood must be one of: sad, happy, surprised, Neutral'),

  // Custom validation for files (multer puts them in req.files)
  (req, res, next) => {
    if (!req.files || !req.files.poster || !req.files.song) {
      return res.status(400).json({
        success: false,
        message: 'Both poster image and song file are required',
      });
    }
    next();
  },
];