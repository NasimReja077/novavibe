import { useSelector } from "react-redux";
import { useSongs } from "../../songs/hook/useSongs.js";
import { usePlaylists } from "../../playlists/hook/usePlaylist.js";
import { useBookmarks } from "../../bookmarks/hook/useBookmarks.js";

export const useDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    mySongs,
    loading: songsLoading, uploading,
    error: songsError, fetchMySongs, uploadSong,
  } = useSongs();

  const {
    playlists,
    loading: playlistsLoading,
    error: playlistsError, fetchPlaylists,
  } = usePlaylists();

  const { bookmarks, loading: bookmarksLoading, fetchBookmarks } = useBookmarks();

  const loadDashboard = () => {
    if (user?.id) fetchMySongs(user.id);
    fetchPlaylists();
    fetchBookmarks();
  };

  return {
    user,

    mySongs,
    songsLoading,
    uploading,
    songsError,
    uploadSong,

    playlists,
    playlistsLoading,
    playlistsError,

    bookmarks,
    bookmarksLoading,

    stats: {
      songCount: mySongs.length,
      playlistCount: playlists.length,
      bookmarkCount: bookmarks.length,
    },

    loadDashboard,
  };
};