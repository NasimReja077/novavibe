import { RouterProvider } from "react-router"
import { routes } from "./app.routes.jsx"
import Providers from "./providers.jsx"

const App = () => {
  return (
    <>
    <Providers>
      <RouterProvider router={routes}/>
    </Providers>
    </>
  )
}

export default App