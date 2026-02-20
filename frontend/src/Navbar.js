import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onLoginClick, onSignupClick }) {
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
        <button className="auth-btn" onClick={onLoginClick}>
          Login
        </button>

        <button
          className="auth-btn signup"
          onClick={onSignupClick}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
