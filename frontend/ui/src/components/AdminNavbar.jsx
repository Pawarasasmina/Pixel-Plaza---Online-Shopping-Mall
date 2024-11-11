import React, { useState } from "react";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineCog,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/PixelPlaza.svg";
import { useUserSession } from "./UserSession"; // Use the custom hook

const AdminNavbar = () => {
  const location = useLocation();
  const { user, clearUserSession } = useUserSession(); // Use the hook to access user and clear function
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearUserSession(); // Clear user data from local storage
    window.location.href = "/"; // Redirect to homepage or login page
  };

  return (
    <div className="fixed flex justify-between items-center h-[5rem] w-full bg-secondary z-50 px-6 shadow-lg">
      {/* Left Section: Logo and Navigation Links */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-24 mr-48" />
        <ul className="flex text-xl font-russoone space-x-16 text-primary">
          {" "}
          {/* Increased space-x to 16 */}
          <li
            className={`hover:scale-110 cursor-pointer transition-transform duration-200 ease-in-out ${
              location.pathname === "/Shoppanel" ? "text-baseextra2" : ""
            }`}
          >
            <Link to={`/Shoppanel`}>Shop Panel</Link>
          </li>
          <li
            className={`hover:scale-110 cursor-pointer transition-transform duration-200 ease-in-out ${
              location.pathname === "/MapModel" ? "text-baseextra2" : ""
            }`}
          >
            <Link to={`/feedbacksadmin`}>Feedbacks</Link>
          </li>
        </ul>
      </div>

      {/* Right Section: Icons and Logout */}
      <div className="flex items-center space-x-8">
        {" "}
        {/* Increased space-x to 8 for wider gaps */}
        <Link
          to="/adminDashboard"
          className="hover:text-baseextra2 transition-colors"
        >
          <HiOutlineHome className="text-3xl text-primary mr-6" />
        </Link>
        {/* Dropdown for Admin Management */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hover:text-baseextra2 transition-colors"
          >
            <HiOutlineUsers className="text-3xl text-primary mr-6" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 bg-dark text-light shadow-lg rounded-lg w-48 z-50 mt-2">
              <ul className="py-2 space-y-2">
                <li className="px-4 py-2 hover:bg-primary hover:text-light rounded-lg">
                  <Link to="/CreateAdmin">Add Admin</Link>
                </li>
                <li className="px-4 py-2 hover:bg-primary hover:text-light rounded-lg">
                  <Link to="/CreateSeller">Add Seller</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* Profile and Settings Links */}
        <Link to="/profile" className="hover:text-baseextra2 transition-colors">
          <HiOutlineUserCircle className="text-3xl text-primary mr-16" />
        </Link>
        {/* Log Out Button */}
        <button
          className="mt-auto bg-primary text-light rounded-full py-2 px-4 hover:bg-opacity-80 font-russoone transition-transform duration-200 ease-in-out"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
