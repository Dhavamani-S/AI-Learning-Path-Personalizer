import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={require("./assets/logo.png")}
          alt="Learning Path Logo"
          className="logo-img"
        />
        <span className="brand-name">Learning Path</span>
      </div>

      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          // ✅ Show logout when logged in
          <button className="auth-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          // ✅ Show login/signup when not logged in
          <>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="auth-btn signup" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;