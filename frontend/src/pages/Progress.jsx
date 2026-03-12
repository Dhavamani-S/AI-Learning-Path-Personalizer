import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Progress.css";
import API_URL from "../config";

const Progress = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all roadmaps on page load
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem("token");
       const res = await axios.get(`${API_URL}/api/roadmap/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRoadmaps(res.data);

        const savedId = localStorage.getItem("roadmapId");
        if (savedId) {
          const found = res.data.find((r) => r._id === savedId);
          if (found) {
            setSelectedRoadmapId(found._id);
            setSelectedRoadmap(found);
          } else {
            setSelectedRoadmapId(res.data[0]._id);
            setSelectedRoadmap(res.data[0]);
          }
        } else {
          setSelectedRoadmapId(res.data[0]._id);
          setSelectedRoadmap(res.data[0]);
        }
      } catch (err) {
        setError("Failed to load roadmaps.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleRoadmapChange = (e) => {
    const id = e.target.value;
    setSelectedRoadmapId(id);
    const found = roadmaps.find((r) => r._id === id);
    setSelectedRoadmap(found);
  };

  // ✅ Delete roadmap
  const handleDeleteRoadmap = async () => {
    if (!window.confirm(`Are you sure you want to delete the "${selectedRoadmap.targetField}" roadmap? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/roadmap/${selectedRoadmap._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Remove from list
      const updated = roadmaps.filter((r) => r._id !== selectedRoadmap._id);
      setRoadmaps(updated);

      if (updated.length > 0) {
        setSelectedRoadmapId(updated[0]._id);
        setSelectedRoadmap(updated[0]);
      } else {
        setSelectedRoadmap(null);
        setSelectedRoadmapId("");
      }

      localStorage.removeItem("roadmapId");
    } catch (err) {
      alert("Failed to delete roadmap.");
    }
  };

  const handleCompleteDay = async (day) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/roadmap/${selectedRoadmap._id}/complete/${day}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRoadmap(res.data.roadmap);
      setRoadmaps((prev) =>
        prev.map((r) => (r._id === selectedRoadmap._id ? res.data.roadmap : r))
      );
    } catch (err) {
      alert("Failed to mark day as complete.");
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${selectedRoadmap.targetField} - Learning Roadmap`, 14, 20);
    doc.setFontSize(10);
    doc.text(
      `Experience: ${selectedRoadmap.experience} | Duration: ${selectedRoadmap.duration} months | Mastery: ${selectedRoadmap.masteryLevel}`,
      14, 30
    );

    const tableColumn = ["Day", "Topic", "Subtopic", "Duration", "Resource", "Status"];
    const tableRows = selectedRoadmap.modules.map((item) => {
      const youtube = item.resources?.find((r) => r.type === "youtube");
      return [
        `Day ${item.day}`,
        item.topic,
        item.subtopic,
        item.duration,
        youtube?.url || "N/A",
        item.isCompleted ? "Done" : "Pending",
      ];
    });

    autoTable(doc, {
      startY: 38,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`${selectedRoadmap.targetField}_Roadmap.pdf`);
  };

  // ═══════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════
  if (loading) {
  return (
    <div className="progress-page">
      <div className="progress-top">
        <div className="progress-header">
          <h2>Hey, {JSON.parse(localStorage.getItem("user") || "{}").name || "there"}! 🚀 Ready to level up today?</h2>
        </div>
      </div>
      <div className="progress-center">
        <div className="empty-state">
          <div className="empty-orb"></div>
          <div className="loading-spinner"></div>
          <h3>Loading your roadmaps...</h3>
          <p>Hang tight while we fetch your learning paths</p>
        </div>
      </div>
    </div>
  );
}

  // ═══════════════════════════════════════
  // EMPTY STATE
  // ═══════════════════════════════════════
  if (error || roadmaps.length === 0) {
  return (
    <div className="progress-page">
      <div className="progress-top">
        <div className="progress-header">
          <h2>Hey, {JSON.parse(localStorage.getItem("user") || "{}").name || "there"}! 🚀 Ready to level up today?</h2>
        </div>
      </div>
      <div className="progress-center">
        <div className="empty-state">
          <div className="empty-orb"></div>
          <div className="empty-icon">🗺️</div>
          <h3>No roadmaps yet!</h3>
          <p>Your personalized learning journey is just one click away</p>
          <a href="/generate" className="empty-btn">Build My First Roadmap →</a>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="progress-page">

      {/* ✅ Fixed Top Section */}
      <div className="progress-top">
        <div className="progress-header">
          <div>
            {/* ✅ User greeting */}
            <h2>Hey, {JSON.parse(localStorage.getItem("user") || "{}").name || "there"}! Ready to level up today?</h2>
            <p>
              {selectedRoadmap?.targetField} — {selectedRoadmap?.experience} —{" "}
              {selectedRoadmap?.duration} months —{" "}
              <strong>{selectedRoadmap?.percentageComplete || 0}% Complete</strong>
            </p>
          </div>

          <div className="header-controls">
            <select
              className="roadmap-select"
              value={selectedRoadmapId}
              onChange={handleRoadmapChange}
            >
              {roadmaps.map((rm) => (
                <option key={rm._id} value={rm._id}>
                  {rm.targetField} ({rm.experience})
                </option>
              ))}
            </select>

            <button className="download-btn" onClick={handleDownload}>
              Download PDF
            </button>

            {/* ✅ Delete roadmap button */}
            <button className="delete-btn" onClick={handleDeleteRoadmap}>
              🗑 Delete
            </button>
          </div>
        </div>

        {/* ✅ Progress Bar */}
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-fill"
            style={{ width: `${selectedRoadmap?.percentageComplete || 0}%` }}
          />
        </div>
      </div>

      {/* ✅ Scrollable Table */}
      <div className="progress-container">
        <div className="table-wrapper">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Phase</th>
                <th>Topic</th>
                <th>Subtopic</th>
                <th>Duration</th>
                <th>Resources</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedRoadmap?.modules.map((item, index) => (
                <tr key={index} className={item.isCompleted ? "completed-row" : ""}>
                  <td>Day {item.day}</td>
                  <td>
                    <span className={`phase-badge phase-${item.phase?.toLowerCase() || "beginner"}`}>
                      {item.phase || "Beginner"}
                    </span>
                  </td>
                  <td>{item.topic}</td>
                  <td>{item.subtopic}</td>
                  <td>{item.duration}</td>

                  {/* ✅ Resource Links */}
                  <td>
                    <div className="resource-links">
                      {item.resources && item.resources.length > 0 ? (
                        item.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`resource-badge ${res.type === "youtube" ? "badge-youtube" : "badge-article"}`}
                          >
                            {res.type === "youtube" ? "▶ YouTube" : "📄 Article"}
                          </a>
                        ))
                      ) : (
                        <span className="no-resource">—</span>
                      )}
                    </div>
                  </td>

                  {/* ✅ Status */}
                  <td>
                    {item.isCompleted ? (
                      <span className="status-done">✅ Done</span>
                    ) : (
                      <button
                        className="complete-btn"
                        onClick={() => handleCompleteDay(item.day)}
                      >
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Progress;