import React, { useState } from "react";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineCog,
} from "react-icons/hi";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/PixelPlaza.svg";
import { useUserSession } from "./UserSession"; // Use the custom hook

export const AdminSidebar = () => {
  const [selected, setSelected] = useState("Admin Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();
  const { user, clearUserSession } = useUserSession(); // Use the hook to access user and clear function

  const handleItemClick = (label) => {
    if (selected === label) {
      setDropdownOpen(dropdownOpen === label ? null : label);
    } else {
      setSelected(label);
      setDropdownOpen(label);
    }
  };

  const handleLogout = () => {
    clearUserSession(); // Clear user data from local storage
    window.location.href = "/"; // Redirect to homepage or login page
  };

  return (
    <div className="fixed top-0 left-0 flex flex-col bg-dark text-light w-64 h-screen p-4 z-50">
      <div className="flex justify-center mb-8">
        <img src={Logo} alt="Logo" className="h-20" />
      </div>
      <nav className="space-y-10">
        <SidebarItem
          Icon={HiOutlineHome}
          label="Admin Dashboard"
          link="/adminDashboard"
          isActive={location.pathname === "/adminDashboard"}
          handleItemClick={handleItemClick}
          selected={selected}
        />
        <SidebarItem
          Icon={HiOutlineUsers}
          label="Manage Users"
          selected={selected}
          dropdownOpen={dropdownOpen}
          handleItemClick={handleItemClick}
          dropdownItems={[
            { label: "Add Admins", link: "/CreateAdmin" },
            { label: "Add Sellers", link: "/CreateSeller" },
          ]}
        />
        <SidebarItem
          Icon={HiOutlineUserCircle}
          label="Profile"
          selected={selected}
          link="/profile"
          handleItemClick={handleItemClick}
        />
        <SidebarItem
          Icon={HiOutlineCog}
          label="Settings"
          selected={selected}
          link="/settings"
          handleItemClick={handleItemClick}
        />
      </nav>
      <button
        className="mt-auto bg-primary text-light rounded-full py-2 px-4 hover:bg-opacity-80 font-russo"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

const SidebarItem = ({
  Icon,
  label,
  link,
  selected,
  dropdownItems,
  dropdownOpen,
  handleItemClick,
}) => {
  const isSelected = selected === label;
  const isDropdownOpen = dropdownOpen === label;

  return (
    <motion.div
      whileHover={{
        borderColor: "#E76F51",
        transition: { duration: 0.3 },
      }}
      className={`relative flex flex-col cursor-pointer p-4 rounded-lg font-russo text-xl ${
        isSelected ? "border-2 border-primary" : "border-2 border-transparent"
      }`}
      onClick={() => handleItemClick(label)}
      initial={{ borderColor: "transparent" }}
      animate={{
        borderColor: isSelected ? "#E76F51" : "transparent",
        transition: { duration: 0.3 },
      }}
    >
      {link && !dropdownItems ? (
        <Link to={link}>
          <motion.div
            whileHover={{
              scale: 1.2,
              color: "#E76F51",
              transition: { duration: 0.3 },
            }}
            className={`flex items-center space-x-3 ${
              isSelected ? "text-primary" : "text-light"
            }`}
          >
            <Icon className="text-3xl" />
            <span>{label}</span>
          </motion.div>
        </Link>
      ) : (
        <motion.div
          whileHover={{
            scale: 1.2,
            color: "#E76F51",
            transition: { duration: 0.3 },
          }}
          className={`flex items-center space-x-3 ${
            isSelected ? "text-primary" : "text-light"
          }`}
        >
          <Icon className="text-3xl" />
          <span>{label}</span>
        </motion.div>
      )}

      {dropdownItems && isDropdownOpen && (
        <div className="absolute left-full ml-2 bg-dark shadow-lg rounded-lg w-48 z-50">
          <ul className="py-2 space-y-2">
            {dropdownItems.map((item) => (
              <li
                key={item.label}
                className="px-4 py-2 hover:bg-primary hover:text-light rounded-lg"
              >
                <Link to={item.link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};
