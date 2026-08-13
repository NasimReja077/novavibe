
import songModel from '../models/song.model.js'
import { uploadSongFiles } from '../services/storage.service.js'

export const createSong = async (req, res) =>{
     try {
          const { title, mood } = req.body;
          const posterFile = req.files.poster[0];
          const songFile = req.files.song[0];

          const { posterUrl, songUrl, posterFileId, songFileId } = await uploadSongFiles(
               posterFile,
               songFile
          )

          const newSong = await songModel.createSong({
               title,
      mood: mood || 'Neutral',
      posterUrl,
      url: songUrl, // your schema uses "url" for the audio
      // Optional: store fileIds if you want to delete later
      // posterFileId,
      // songFileId,
          })

          res.status(201).json({
               success: true,
               message: 'Song uplode Succesfully',
               data: newSong,
          });

     } catch (error) {
          console.error(error)
          res.status(500).json({
               success: false,
               message: error.message || 'Something went wrong while uploading song',
          })
     }
} 