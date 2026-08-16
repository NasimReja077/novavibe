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

  return {
    playlists: list,
    currentPlaylist: current,
    loading,
    creating,
    error,

    fetchPlaylists: () => dispatch(fetchAllPlaylists()),
    fetchPlaylist: (id) => dispatch(fetchPlaylistById(id)),
    createPlaylist: (formData) => dispatch(createPlaylist(formData)),
    clearError: () => dispatch(clearPlaylistError()),
    clearCurrentPlaylist: () => dispatch(clearCurrentPlaylist()),
  };
};