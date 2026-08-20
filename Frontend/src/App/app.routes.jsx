import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";

import AppLayout from "./AppLayout.jsx";
import Protected from "../features/auth/components/Protected.jsx";

const Home = lazy(() => import("../features/songs/pages/Home.jsx"));
const SongsDetail = lazy(() => import("../features/songs/pages/SongsDetail.jsx"));
const Playlists = lazy(() => import("../features/playlists/pages/Playlists.jsx"));
const PlaylistDetail = lazy(() => import("../features/playlists/pages/PlaylistDetail.jsx"));
const CreatePlaylist = lazy(() => import("../features/playlists/pages/CreatePlaylist.jsx"));
const RecentlyPlayed = lazy(() => import("../features/recentlyPlayed/pages/RecentlyPlayed.jsx"));
const Bookmarks = lazy(() => import("../features/bookmarks/pages/Bookmarks.jsx"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard.jsx"));
const UploadSong = lazy(() => import("../features/dashboard/pages/UploadSong.jsx"));
const Profile = lazy(() => import("../features/auth/pages/Profile.jsx"));
const Login = lazy(() => import("../features/auth/pages/Login.jsx"));
const Register = lazy(() => import("../features/auth/pages/Register.jsx"));

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