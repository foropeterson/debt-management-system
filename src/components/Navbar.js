import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false); // Track mobile view

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsMobile(!isMobile);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">chipset computers</h1>

        <ul className={`navbar-links ${isMobile ? "active" : ""}`}>
          <li>
            <Link
              to="/"
              className="navbar-link"
              onClick={() => setIsMobile(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
          </li>
        </ul>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
