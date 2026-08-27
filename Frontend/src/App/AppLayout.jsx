import { useState } from "react";
import Navbar from "../features/Shared/Components/Navbar.jsx";
import BottomPlayer from "../features/player/components/BottomPlayer.jsx";
import { Outlet, useNavigate } from "react-router";

const AppLayout = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim()) navigate("/");
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e4e1e6] flex flex-col selection:bg-[#d62b70] selection:text-white">
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <main className="flex-1">
        <Outlet context={{ searchTerm, clearSearch }} />
      </main>
      <BottomPlayer />
    </div>
  );
};

export default AppLayout;
