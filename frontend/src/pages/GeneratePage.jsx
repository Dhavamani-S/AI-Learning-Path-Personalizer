import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GeneratePage.css";
import API_URL from "../config";

const GeneratePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    education: "",
    targetField: "",
    experience: "",
    duration: "",
    masteryLevel: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/roadmap/generate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("roadmapId", res.data.roadmap._id);
      navigate("/progress");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-page">
      {/* Background */}
      <div className="gen-orb gen-orb-1"></div>
      <div className="gen-orb gen-orb-2"></div>

      <div className="generate-container">
        {/* Header */}
        <div className="gen-header">
          <div className="badge">✦ Step {step} of 2</div>
          <h1>Build Your Learning Path</h1>
          <p>Tell us about yourself and we'll generate a personalized roadmap</p>
        </div>

        {/* Progress bar */}
        <div className="step-bar">
          <div className="step-fill" style={{ width: step === 1 ? "50%" : "100%" }}></div>
        </div>

        {error && <div className="gen-error">{error}</div>}

        {/* Step 1 */}
        {step === 1 && (
          <div className="gen-card">
            <h2>About You</h2>

            <div className="gen-group">
              <label>Educational Background</label>
              <input
                type="text"
                name="education"
                placeholder="e.g. B.Tech Computer Science"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            <div className="gen-group">
              <label>Target Field</label>
              <input
                type="text"
                name="targetField"
                placeholder="e.g. Data Science, Cooking, Marine Biology..."
                value={formData.targetField}
                onChange={handleChange}
                required
              />
            </div>

            <div className="gen-group">
              <label>Experience Level</label>
              <div className="option-grid">
                {["Beginner", "Intermediate", "Advanced"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`option-btn ${formData.experience === opt ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, experience: opt })}
                  >
                    {opt === "Beginner" ? "🌱" : opt === "Intermediate" ? "🚀" : "⚡"} {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="gen-next-btn"
              onClick={() => {
                if (!formData.targetField || !formData.experience) {
                  setError("Please fill Target Field and Experience Level.");
                  return;
                }
                setError("");
                setStep(2);
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="gen-card">
            <h2>Your Goals</h2>

            <div className="gen-group">
              <label>Learning Duration (Months)</label>
              <div className="option-grid">
                {["1", "2", "3", "6", "9", "12"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`option-btn ${formData.duration === opt ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, duration: opt })}
                  >
                    {opt} {opt === "1" ? "Month" : "Months"}
                  </button>
                ))}
              </div>
            </div>

            <div className="gen-group">
              <label>Desired Mastery Level</label>
              <div className="option-grid">
                {[
                  { val: "Basic", icon: "📘", desc: "Basic Understanding" },
                  { val: "Professional", icon: "💼", desc: "Professional Level" },
                  { val: "Expert", icon: "🏆", desc: "Expert Level" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`option-btn ${formData.masteryLevel === opt.val ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, masteryLevel: opt.val })}
                  >
                    {opt.icon} {opt.desc}
                  </button>
                ))}
              </div>
            </div>

            <div className="gen-group">
              <label>Description <span className="optional">Optional</span></label>
              <textarea
                name="description"
                placeholder="Tell us your goals, what you already know, or anything specific..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="gen-actions">
              <button className="gen-back-btn" onClick={() => setStep(1)}>← Back</button>
              <button
                className="gen-submit-btn"
                onClick={handleSubmit}
                disabled={loading || !formData.duration || !formData.masteryLevel}
              >
                {loading ? "⏳ Generating..." : "Generate My Roadmap 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePage;