import { useCallback } from "react";
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

  const loadBookmarks = useCallback(() => dispatch(
    fetchBookmarks()
  ), [dispatch]);

  const saveBookmark = useCallback((songId) => dispatch(
    addBookmark(songId)
  ), [dispatch]);

  const deleteBookmark = useCallback((songId) => dispatch(
    removeBookmark(songId)
  ), [dispatch]);

  const clearError = useCallback(() => dispatch(
    clearBookmarkError()
  ), [dispatch]);

  const isBookmarked = (songId) =>
    list.some((b) => (b.songId?._id || b.songId) === songId);

  return {
    bookmarks: list,
    loading,
    error,
    isBookmarked,

    fetchBookmarks: loadBookmarks,
    addBookmark: saveBookmark,
    removeBookmark: deleteBookmark,
    clearError,
  };
};