import Navbar from "../features/Shared/Components/Navbar.jsx";
import BottomPlayer from "../features/player/components/BottomPlayer.jsx";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] flex flex-col selection:bg-[#d62b70] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomPlayer />
    </div>
  );
};

export default AppLayout;
