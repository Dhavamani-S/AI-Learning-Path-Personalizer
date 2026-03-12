import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import googleLogo from "../assets/Google_logo.png";
import "./LoginPage.css";
import API_URL from "../config";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ INSIDE component
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      // ✅ Go to page user was trying to visit
      const from = location.state?.from || "/";
      navigate(from);

    } catch (err) {
      const message = err.response?.data?.message;
      if (message === "User not found") {
        setError("No account found with this email. Please sign up first.");
      } else if (message === "Invalid credentials") {
        setError("Wrong password. Please try again.");
      } else if (message?.includes("Google Sign-In")) {
        setError("This account uses Google Sign-In. Please use the Google button below.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${API_URL}/api/auth/google`, {
          credential: tokenResponse.access_token,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onLogin(res.data.user);
        // ✅ Google login also redirects to intended page
        const from = location.state?.from || "/";
        navigate(from);
      } catch {
        setError("Google login failed. Please try again.");
      }
    },
    onError: () => setError("Google login failed. Please try again."),
  });

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <h1>Learning Path</h1>
          <p>Welcome back! Login to continue.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
            {error.includes("sign up") && (
              <span> <Link to="/signup" className="error-link">Sign Up here</Link></span>
            )}
          </div>
        )}

        <button className="google-btn" onClick={() => handleGoogleLogin()}>
          <img src={googleLogo} alt="Google" className="google-icon" />
          Continue with Google
        </button>

        <div className="divider"><span>OR</span></div>

        <form onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;