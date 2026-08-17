import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import playlistReducer from "../features/playlists/state/playlist.slice.js"
import songReducer from "../features/songs/state/song.slice.js"
import recentlyPlayedReducer from "../features/recentlyPlayed/state/recentlyPlayed.slice.js"
import bookmarkReducer from "../features/bookmarks/state/bookmark.slice.js"
import playerReducer from "../features/player/state/player.slice.js"

export const store = configureStore({
     reducer: {
          auth: authReducer,
          playlists: playlistReducer,
          songs: songReducer,
          recentlyPlayed: recentlyPlayedReducer,
          bookmarks: bookmarkReducer,
          player: playerReducer,
     }
})