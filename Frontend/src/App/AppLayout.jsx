import Navbar from "../features/Shared/Components/Navbar.jsx";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <>
      <div >
        <Navbar />
        <main >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AppLayout;
