import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";
import API_URL from "../config";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setSuccess("✅ Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Contact Me</h2>
          <p>Have any questions? Send us a message.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="contact-success">{success}</div>}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
            ></textarea>
          </div>

          <button type="submit" className="send-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;