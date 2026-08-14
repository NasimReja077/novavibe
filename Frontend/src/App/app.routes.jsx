import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router";

import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Home from "../features/songs/pages/Home.jsx";
import AppLayout from "./AppLayout.jsx";
// import Protected from "../features/auth/components/Protected.jsx";
// import SongsDetail from "../features/songs/pages/SongsDetail.jsx";
// import UplodeSong from "../features/dashboard/pages/UplodeSong.jsx";
// import DashboardPage from "../features/dashboard/pages/Dashboard.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
     //  {
     //    path: "song",
     //    element: <SongsDetail />,
     //  },
     //  {
     //    path: "dashboard",
     //    children: [
     //      {
     //        index: true,
     //        element: (
     //          <Protected>
     //            <DashboardPage />
     //          </Protected>
     //        ),
     //      },
     //      {
     //        path: "uplode-song",
     //        element: (
     //          <Protected>
     //            <UplodeSong />
     //          </Protected>
     //        ),
     //      },
     //    ],
     //  },
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