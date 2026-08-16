import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSongs,
  fetchSongById,
  fetchMySongs,
  uploadSong,
  clearSongError,
  clearCurrentSong,
} from "../state/song.slice.js";

export const useSongs = () => {
  const dispatch = useDispatch();
  const { list, current, mySongs, loading, uploading, error } = useSelector(
    (state) => state.songs
  );

  return {
    songs: list,
    currentSong: current,
    mySongs,
    loading,
    uploading,
    error,

    fetchSongs: (params) => dispatch(fetchAllSongs(params)),
    fetchSong: (id) => dispatch(fetchSongById(id)),
    fetchMySongs: (userId) => dispatch(fetchMySongs(userId)),
    uploadSong: (formData) => dispatch(uploadSong(formData)),
    clearError: () => dispatch(clearSongError()),
    clearCurrentSong: () => dispatch(clearCurrentSong()),
  };
};