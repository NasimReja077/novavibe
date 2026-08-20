import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPlaylists,
  fetchPlaylistById,
  createPlaylist,
  clearPlaylistError,
  clearCurrentPlaylist,
} from "../state/playlist.slice.js";

export const usePlaylists = () => {
  const dispatch = useDispatch();
  const { list, current, loading, creating, error } = useSelector(
    (state) => state.playlists
  );

  const loadPlaylists = useCallback(() => dispatch(
    fetchAllPlaylists()), [dispatch]
  );

  const loadPlaylist = useCallback((id) => dispatch(
    fetchPlaylistById(id)), [dispatch]
  );

  const create = useCallback((formData) => dispatch(
    createPlaylist(formData)), [dispatch]
  );

  const clearError = useCallback(() => dispatch(
    clearPlaylistError()), [dispatch]
  );

  const clearCurrent = useCallback(() => dispatch(
    clearCurrentPlaylist()), [dispatch]
  );

  return {
    playlists: list,
    currentPlaylist: current,
    loading,
    creating,
    error,

    fetchPlaylists: loadPlaylists,
    fetchPlaylist: loadPlaylist,
    createPlaylist: create,
    clearError,
    clearCurrentPlaylist: clearCurrent,
  };
};