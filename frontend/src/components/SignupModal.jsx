import React, { useState, useEffect } from "react";
import "./SignupModal.css";
import axios from "axios";

const SignupModal = ({ isOpen, onClose, onSignup }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Stop background scroll when modal opens
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
    // 1️⃣ Register
    await axios.post("http://localhost:5000/api/auth/register", {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    // 2️⃣ Login immediately
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      email: user.email,
      password: user.password,
    });

    // 3️⃣ Store token and user correctly
    localStorage.setItem("token", loginRes.data.token);
    localStorage.setItem("user", JSON.stringify({
      id: loginRes.data._id,
      name: loginRes.data.name,
      email: loginRes.data.email
    }));

    // 4️⃣ Notify parent
    onSignup({
      id: loginRes.data._id,
      name: loginRes.data.name,
      email: loginRes.data.email
    });

    onClose();
  } catch (error) {
    // 🔥 Log exact error from backend
    console.log(error.response?.data);
    alert(error.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className="signup-overlay">
      <div className="signup-container">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>Sign Up</h2>
        <p>Create your account</p>

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

          <input
            type="password"
            placeholder="Enter your password"
            required
            value={user.password}
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
          />

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;