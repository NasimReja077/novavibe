import { createBrowserRouter, Navigate } from "react-router";

import AppLayout from "./AppLayout.jsx";
import Home from "../features/songs/pages/Home.jsx";
import SongsDetail from "../features/songs/pages/SongsDetail.jsx";
import Playlists from "../features/playlists/pages/Playlists.jsx";
import PlaylistDetail from "../features/playlists/pages/PlaylistDetail.jsx";
import CreatePlaylist from "../features/playlists/pages/CreatePlaylist.jsx";
import RecentlyPlayed from "../features/recentlyPlayed/pages/RecentlyPlayed.jsx";
import Bookmarks from "../features/bookmarks/pages/Bookmarks.jsx";
import Dashboard from "../features/dashboard/pages/Dashboard.jsx";
import UploadSong from "../features/dashboard/pages/UploadSong.jsx";
import Profile from "../features/auth/pages/Profile.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Protected from "../features/auth/components/Protected.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "song/:id",
        element: <SongsDetail />,
      },
      {
        path: "playlists",
        element: <Playlists />,
      },
      {
        path: "playlist/:id",
        element: <PlaylistDetail />,
      },
      {
        path: "create-playlist",
        element: (
          <Protected>
            <CreatePlaylist />
          </Protected>
        ),
      },
      {
        path: "recently-played",
        element: (
          <Protected>
            <RecentlyPlayed />
          </Protected>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <Protected>
            <Bookmarks />
          </Protected>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "upload-song",
        element: (
          <Protected>
            <UploadSong />
          </Protected>
        ),
      },
      {
        path: "profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);