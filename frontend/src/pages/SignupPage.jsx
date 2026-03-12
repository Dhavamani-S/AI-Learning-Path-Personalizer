import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import API_URL from "../config";

const SignupPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registerRes = await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );

      if (registerRes.status === 201) {
        const loginRes = await axios.post(
          `${API_URL}/api/auth/login`,
          { email: formData.email, password: formData.password }
        );

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));
        onLogin(loginRes.data.user);
        navigate("/");
      }

    } catch (err) {
      const message = err.response?.data?.message;
      if (message?.includes("already exists") || message?.includes("already registered")) {
        setError("Account already exists. Please login instead.");
      } else {
        setError(message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <h1>Learning Path</h1>
          <p>Create your account to get started.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
            {error.includes("already exists") && (
              <span> <Link to="/login" className="error-link">Login here →</Link></span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;