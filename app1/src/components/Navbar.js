import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from "../images/logo.png";
import API from "../api/config";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // get current URL path

  const handleLogout = () => {
  window.open(`${API}/auth/logout`, "_self");
  };

  const getActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Campus Lost & Found Logo" className="nav-logo" />
        <span className="nav-title">Campus Lost & Found</span>
      </div>

      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li className={`nav-pill ${getActive("/dashboard")}`} onClick={() => navigate("/dashboard")}>
          Home
        </li>
        <li className={`nav-pill ${getActive("/reported-items")}`} onClick={() => navigate("/reported-items")}>
          Reported Items
        </li>
        <li className={`nav-pill ${getActive("/found-items")}`} onClick={() => navigate("/found-items")}>
          Found Items
        </li>
        <li className={`nav-pill ${getActive("/profile")}`} onClick={() => navigate("/profile")}>
          Your Profile
        </li>
      </ul>

      <div className="nav-right">
        {/* Search input removed */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
