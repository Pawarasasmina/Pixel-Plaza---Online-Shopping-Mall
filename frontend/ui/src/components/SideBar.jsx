import React, { useState } from "react";
import {
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useUserSession } from "./UserSession"; // Use the custom hook
import Logo from "../assets/PixelPlaza.svg";

export const Sidebar = ({ setUser }) => {
  const [selected, setSelected] = useState("Overview");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { clearUserSession } = useUserSession(); // Use the hook to access clear function
  const location = useLocation(); // Get the current location

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
          label="Overview"
          link="/overview"
          isActive={location.pathname === "/overview"}
          handleItemClick={handleItemClick}
          selected={selected}
        />
        <SidebarItem
          Icon={HiOutlineTag}
          label="Products"
          selected={selected}
          dropdownOpen={dropdownOpen}
          handleItemClick={handleItemClick}
          dropdownItems={[
            { label: "Add Product", link: "/addproduct" },
            { label: "All Products", link: "/allProducts" },
          ]}
        />
        <SidebarItem
          Icon={HiOutlineCube}
          label="Promotions"
          selected={selected}
          link="/promotions"
          handleItemClick={handleItemClick}
        />
        <SidebarItem
          Icon={HiOutlineUserCircle}
          label="Inventory"
          selected={selected}
          link="/inventory"
          handleItemClick={handleItemClick}
        />
        <SidebarItem
          Icon={HiOutlineLogout}
          label="Seller Profile"
          selected={selected}
          link="/sellerProfile"
          handleItemClick={handleItemClick}
        />
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto bg-primary text-light rounded-full py-2 px-4 hover:bg-opacity-80 font-russo"
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

      {/* Dropdown Menu */}
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
