import { useCallback } from "react";
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

  const loadSongs = useCallback((params) => dispatch(
    fetchAllSongs(params)), [dispatch]
  );
  
  const loadSong = useCallback((id) => dispatch(
    fetchSongById(id)), [dispatch]
  );

  const loadMySongs = useCallback((userId) => dispatch(
    fetchMySongs(userId)), [dispatch]
  );

  const upload = useCallback((formData) => dispatch(
    uploadSong(formData)), [dispatch]
  );

  const clearError = useCallback(() => dispatch(
    clearSongError()), [dispatch]
  );

  const clearCurrent = useCallback(() => dispatch(
    clearCurrentSong()
  ), [dispatch]);

  return {
    songs: list,
    currentSong: current,
    mySongs,
    loading,
    uploading,
    error,

    fetchSongs: loadSongs,
    fetchSong: loadSong,
    fetchMySongs: loadMySongs,
    uploadSong: upload,
    clearError,
    clearCurrentSong: clearCurrent,
  };
};