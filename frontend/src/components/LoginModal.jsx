import React, { useState, useEffect } from "react";
import googleLogo from "../assets/Google_logo.png";
import "./LoginModal.css";
import axios from "axios";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: user.email,
        password: user.password,
      }
    );

    // 🔥 Store token
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    onLogin(res.data.user);
    onClose();

  } catch (error) {
    alert("Invalid credentials");
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Login</h2>
        <p>Please login to continue</p>

        <button className="google-btn">
            <img src={googleLogo} alt="Google logo" className="google-icon" />
              Continue with Google
        </button>


        <div className="divider">OR</div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

          <input
  type="password"
  placeholder="Enter your password"
  required
  value={user.password}
  onChange={(e) =>
    setUser({ ...user, password: e.target.value })
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
