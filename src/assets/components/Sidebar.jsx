import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const uid = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="));
    if (uid) {
      const uidValue = uid.split("=")[1];
      setIsSignedIn(true);

      axios
        .get(`${import.meta.env.VITE_API_URL}/auth/user/${uidValue}`)
        .then((response) => {
          if (response.data.message === "User details fetched successfully") {
            const { username, email } = response.data.data;
            setUserInfo({ username, email });
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "userID=; Max-Age=0; path=/";
    setIsSignedIn(false);
    setUserInfo({ username: "", email: "" });
    navigate("/login");
    toggleSidebar(); // Close sidebar on logout
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 h-screen bg-dark text-white transform z-999 sidebar ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-64 shadow-lg flex flex-col justify-between`}
    >
      <div className="p-6">
        <div className="absolute top-4 right-4 md:hidden">
          <XMarkIcon
            className="w-6 h-6 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <h2 className="text-xl font-bold tracking-wide">CompetiConnect</h2>

        <ul className="mt-8 space-y-2">
          <Link to="/">
            <li className="p-3 mb-2 rounded-lg cursor-pointer transition duration-200 bg-b-dark hover:bg-gray-700">
              Home
            </li>
          </Link>
          <Link to="/competitions">
            <li className="p-3 mb-2 rounded-lg cursor-pointer transition duration-200 bg-b-dark hover:bg-gray-700">
              My Competitions
            </li>
          </Link>
          {/* <Link to="/profile">
            <li className="p-3 mb-2 rounded-lg cursor-pointer transition duration-200 bg-b-dark hover:bg-gray-700">
              Profile
            </li>
          </Link> */}
          <Link to="/add-comp">
          <li>
            <Button
              className="bg-red rounded-lg w-full mt-1 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Add Competition
            </Button>
          </li>
          </Link>
        </ul>
      </div>

      <div className="absolute bottom-4 left-0 w-full p-4 border-t border-gray-700">
        {isSignedIn ? (
          <>
            <h3 className="text-lg font-semibold">{userInfo.username}</h3>
            <p className="text-sm text-gray-400">{userInfo.email}</p>
            <button
              className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-3"
              onClick={handleLogout}
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Exit
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full bg-red hover:bg-red text-white font-medium py-2 rounded-lg"
              onClick={() => {
                navigate("/login");
                toggleSidebar();
              }}
            >
              Login
            </button>
            <p
              className="text-sm text-gray-400 mt-2 text-center cursor-pointer"
              onClick={() => {
                navigate("/signup");
                toggleSidebar();
              }}
            >
              Sign in to continue
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
