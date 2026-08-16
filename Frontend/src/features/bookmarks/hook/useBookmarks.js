import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookmarks,
  addBookmark,
  removeBookmark,
  clearBookmarkError,
} from "../state/bookmark.slice.js";

export const useBookmarks = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.bookmarks);

  const isBookmarked = (songId) =>
    list.some((b) => (b.songId?._id || b.songId) === songId);

  return {
    bookmarks: list,
    loading,
    error,
    isBookmarked,

    fetchBookmarks: () => dispatch(fetchBookmarks()),
    addBookmark: (songId) => dispatch(addBookmark(songId)),
    removeBookmark: (songId) => dispatch(removeBookmark(songId)),
    clearError: () => dispatch(clearBookmarkError()),
  };
};