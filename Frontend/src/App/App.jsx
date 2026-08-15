import { RouterProvider } from "react-router"
import { routes } from "./app.routes.jsx"
import Providers from "./providers.jsx"
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
    <Providers>
      <RouterProvider router={routes}/>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "12px",
            fontSize: "13px",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)",
          },
          success: {
            style: {
              background: "#0f172a",
              border: "1px solid rgba(34, 197, 94, 0.4)",
            },
          },
          error: {
            style: {
              background: "#111827",
              border: "1px solid rgba(239, 68, 68, 0.4)",
            },
          },
        }}
      />
    </Providers>
    </>
  )
}

export default App