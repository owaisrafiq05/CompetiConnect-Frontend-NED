import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Navbar from "./assets/components/Navbar";
import Competition from "./pages/Competition";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Home from "./pages/Home"; // ✅ FIX: Import Home
import CompetitonPage from "./pages/CompetitonPage";
import Login from "./pages/Login";
import SignUp from "./pages/Signup"
import { toast , Toaster } from "sonner";
import AddComp from "./pages/AddComp";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Define paths where the sidebar should not be shown
  const noSidebarPaths = ["/login", "/signup"];

  return (
    <div className="flex">
      {/* Sidebar should only render if the current path is not login or signup */}
      {!noSidebarPaths.includes(location.pathname) && (
        <>
          <Toaster/>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto bg-gray-100">
        {/* Navbar for Mobile */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div>
          <Routes>
            <Route path="/" element={<Home />} /> {/* ✅ Home Route Fixed */}
            <Route path="/competitions" element={<Competition />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/competition-page/:id" element={<CompetitonPage/>} />
            <Route path="/add-comp" element={<AddComp/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
