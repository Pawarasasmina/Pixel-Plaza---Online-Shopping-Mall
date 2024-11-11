import React, { useState } from "react";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/PixelPlaza.svg";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Update URL query parameter without reloading the page
    navigate(`/itemlist?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/itemlist">
          <img src={Logo} alt="Pixel Plaza Logo" className="logo-image" />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <a href="/home#categories">Categories</a>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/feedbacklist">Feedbacks</Link>
        </li>
      </ul>
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search for items..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
      <div className="nav-icons">
        <Link to="/wishlist" className="icon">
          <i className="fas fa-heart"></i>
        </Link>
        <Link to="/cart" className="icon">
          <i className="fas fa-shopping-cart"></i>
        </Link>
        <Link to="/profile" className="icon">
          <i className="fas fa-user"></i>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
