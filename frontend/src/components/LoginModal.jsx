import React, { useState } from "react";
import googleLogo from "../assets/Google_logo.png";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(user);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Login / Sign Up</h2>
        <p>Please login to continue</p>

        <button className="google-btn">
            <img src={googleLogo} alt="Google logo" className="google-icon" />
              Continue with Google
        </button>


        <div className="divider">OR</div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            required
            value={user.name}
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Enter your email"
            required
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
