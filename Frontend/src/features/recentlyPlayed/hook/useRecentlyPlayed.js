import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentlyPlayed,
  addRecentlyPlayed,
  clearRecentlyPlayed,
  clearRecentlyPlayedError,
} from "../state/recentlyPlayed.slice.js";

export const useRecentlyPlayed = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.recentlyPlayed);

  return {
    recentlyPlayed: list,
    loading,
    error,

    fetchRecentlyPlayed: () => dispatch(fetchRecentlyPlayed()),
    addRecentlyPlayed: (songId) => dispatch(addRecentlyPlayed(songId)),
    clearRecentlyPlayed: () => dispatch(clearRecentlyPlayed()),
    clearError: () => dispatch(clearRecentlyPlayedError()),
  };
};