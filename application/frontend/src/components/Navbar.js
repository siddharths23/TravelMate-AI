import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ user }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(token !== null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-text">
          TravelMate
        </Link>
        <div
          className={`menu-icon ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <div />
          <div />
          <div />
        </div>
      </div>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/explore" className="nav-link">
          Explore
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/reviews" className="nav-link">
          Experiences
        </Link>
        {loggedIn ? (
          <Link onClick={handleLogout} className="nav-link logout-link">
            <span className="user-initials">
              {user.firstName[0]}
              {user.lastName[0]}
            </span>
            <span className="logout-text">Logout</span>
          </Link>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
