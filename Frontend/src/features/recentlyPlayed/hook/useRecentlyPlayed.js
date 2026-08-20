import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentlyPlayed,
  addRecentlyPlayed,
  clearRecentlyPlayed,
  clearRecentlyPlayedError,
} from "../state/recentlyPlayed.slice.js";

export const useRecentlyPlayed = () => {
  const dispatch = useDispatch();
  
  const { list, loading, error } = useSelector(
    (state) => state.recentlyPlayed
  );

  const loadRecentlyPlayed = useCallback(() => dispatch(
    fetchRecentlyPlayed()
  ), [dispatch]);

  const addRecentSong = useCallback((songId) => dispatch(
    addRecentlyPlayed(songId)
  ), [dispatch]);

  const clearRecently = useCallback(() => dispatch(
    clearRecentlyPlayed()
  ), [dispatch]);

  const clearError = useCallback(() => dispatch(
    clearRecentlyPlayedError()
  ), [dispatch]);

  return {
    recentlyPlayed: list,
    loading,
    error,

    fetchRecentlyPlayed: loadRecentlyPlayed,
    addRecentlyPlayed: addRecentSong,
    clearRecentlyPlayed: clearRecently,
    clearError,
  };
};