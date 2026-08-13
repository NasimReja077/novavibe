import multer from "multer";
import path from "path";

// Memory storage (best practice with ImageKit - no local disk needed)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif/;
  const allowedAudioTypes = /mp3|mpeg|wav|ogg|m4a|aac|flac/;

  const ext = path.extname(file.originalname).toLowerCase().replace('.','');
  const mimetype = file.mimetype;

  if (file.fieldname === 'poster' || file.fieldname === 'thumbnail' || file.fieldname === 'playlistThumbnail') {
    if (allowedImageTypes.test(ext) && mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed for poster or thumbnail (jpg, png, webp, gif)'), false);
  }

  if (file.fieldname === 'song' || file.fieldname === 'audio'){
    if (allowedAudioTypes.test(ext) || mimetype.startsWith('audio/')){
        return cb(null, true);
    }
    return cb(new Error('Only audio files are allowed (mp3, wav, ogg, m4a, aac, flac)'), false);
  }
  cb(new Error('Invalid field name'), false);
}
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (adjust as needed)
  },
});


// Middleware for uploading both poster + song
export const uploadSongFiles = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'song', maxCount: 1 }, // or 'audio'
]);

export const uploadPlaylistThumbnail = upload.single('thumbnail');

// Single file uploaders (if needed elsewhere)
export const uploadPoster = upload.single('poster');
export const uploadSong = upload.single('song');
