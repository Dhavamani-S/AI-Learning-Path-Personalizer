import React, { useState } from "react";
import "./Home.css";

const Home = ({ isLoggedIn, onRequireLogin }) => {
  const [formData, setFormData] = useState({
    education: "",
    targetField: "",
    experience: "",
    duration: "",
    masteryLevel: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 LOGIN CHECK
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    console.log("User Input:", formData);
  };

  return (
    <div className="home-container">
      <div className="form-card">
        <h2>Create Your Personalized Learning Path</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Educational Background</label>
            <input
              type="text"
              name="education"
              placeholder="e.g. B.Tech Computer Science"
              value={formData.education}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Target Field</label>
            <input
              type="text"
              name="targetField"
              placeholder="e.g. Data Science, Web Development"
              value={formData.targetField}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Experience in Target Field</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience</option>
              <option value="Beginner">Beginner (0-1 year)</option>
              <option value="Intermediate">Intermediate (1-3 years)</option>
              <option value="Advanced">Advanced (3+ years)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Learning Duration (in Months)</label>
            <input
              type="number"
              name="duration"
              placeholder="e.g. 6"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Desired Mastery Level</label>
            <select
              name="masteryLevel"
              value={formData.masteryLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select Mastery Level</option>
              <option value="Basic">Basic Understanding</option>
              <option value="Professional">Professional Level</option>
              <option value="Expert">Expert Level</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Generate Learning Path
          </button>

        </form>
      </div>
    </div>
  );
};

export default Home;
