import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const orbRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStart = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/generate");
    }
  };

  return (
    <div className="landing">
      {/* Background orbs */}
      <div className="orb orb-1" ref={orbRef}></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Hero */}
      <div className="hero">
        <div className="badge">✦ AI-Powered Learning</div>

        <h1 className="hero-title">
          Your Path.<br />
          <span className="gradient-text">Your Pace.</span><br />
          Your Future.
        </h1>

        <p className="hero-sub">
          Drop your goal. Get a personalized day-by-day learning roadmap
          built by AI — with resources, timelines, and structure.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={handleStart}>
            Build My Roadmap →
          </button>
          <button className="btn-ghost" onClick={() => navigate("/progress")}>
            View Progress
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <span className="stat-num">50+</span>
            <span className="stat-label">Domains</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">AI</span>
            <span className="stat-label">Powered</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">Free</span>
            <span className="stat-label">To Use</span>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Personalized</h3>
          <p>Roadmap built around your experience, goals and available time</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Any Domain</h3>
          <p>From Web Dev to Marine Biology — AI generates topics for anything</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Real Resources</h3>
          <p>YouTube videos and documentation links for every single day</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Track Progress</h3>
          <p>Mark days complete and watch your progress grow over time</p>
        </div>
      </div>
    </div>
  );
};

export default Home;