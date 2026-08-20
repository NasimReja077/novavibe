import { createBrowserRouter, Navigate } from "react-router";

import AppLayout from "./AppLayout.jsx";
import Protected from "../features/auth/components/Protected.jsx";

const lazyPage = (loadPage) => async () => ({
  Component: (await loadPage()).default,
});

const protectedLazyPage = (loadPage) => async () => {
  const Page = (await loadPage()).default;

  return {
    Component: () => (
      <Protected>
        <Page />
      </Protected>
    ),
  };
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        lazy: lazyPage(() => import("../features/songs/pages/Home.jsx")),
      },
      {
        path: "song/:id",
        lazy: lazyPage(() => import("../features/songs/pages/SongsDetail.jsx")),
      },
      {
        path: "playlists",
        lazy: lazyPage(() => import("../features/playlists/pages/Playlists.jsx")),
      },
      {
        path: "playlist/:id",
        lazy: lazyPage(() => import("../features/playlists/pages/PlaylistDetail.jsx")),
      },
      {
        path: "create-playlist",
        lazy: protectedLazyPage(() => import("../features/playlists/pages/CreatePlaylist.jsx")),
      },
      {
        path: "recently-played",
        lazy: protectedLazyPage(() => import("../features/recentlyPlayed/pages/RecentlyPlayed.jsx")),
      },
      {
        path: "bookmarks",
        lazy: protectedLazyPage(() => import("../features/bookmarks/pages/Bookmarks.jsx")),
      },
      {
        path: "dashboard",
        lazy: protectedLazyPage(() => import("../features/dashboard/pages/Dashboard.jsx")),
      },
      {
        path: "upload-song",
        lazy: protectedLazyPage(() => import("../features/dashboard/pages/UploadSong.jsx")),
      },
      {
        path: "profile",
        lazy: protectedLazyPage(() => import("../features/auth/pages/Profile.jsx")),
      },
    ],
  },
  {
    path: "/login",
    lazy: lazyPage(() => import("../features/auth/pages/Login.jsx")),
  },
  {
    path: "/register",
    lazy: lazyPage(() => import("../features/auth/pages/Register.jsx")),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);