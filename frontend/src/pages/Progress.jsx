import React, { useState } from "react";
import "./Progress.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Progress = () => {
  // 🔹 Simulated multiple roadmaps for one user
  const roadmaps = [
    {
      _id: "1",
      title: "Frontend Development",
      progress: [
        {
          day: "Day 1",
          topic: "HTML Fundamentals",
          subtopic: "Basic Structure & Tags",
          link: "https://example.com/html",
          duration: 2,
        },
        {
          day: "Day 2",
          topic: "CSS Basics",
          subtopic: "Selectors & Box Model",
          link: "https://example.com/css",
          duration: 3,
        },
      ],
    },
    {
      _id: "2",
      title: "Backend Development",
      progress: [
        {
          day: "Day 1",
          topic: "Node.js Basics",
          subtopic: "Modules & NPM",
          link: "https://example.com/node",
          duration: 3,
        },
        {
          day: "Day 2",
          topic: "Express.js",
          subtopic: "Routing & Middleware",
          link: "https://example.com/express",
          duration: 4,
        },
      ],
    },
  ];

  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmaps[0]._id);

  const selectedRoadmap = roadmaps.find(
    (rm) => rm._id === selectedRoadmapId
  );

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${selectedRoadmap.title} - Learning Progress`, 14, 20);

    const tableColumn = [
      "Day",
      "Topic",
      "Subtopic",
      "Resource Link",
      "Duration (Hours)",
    ];

    const tableRows = selectedRoadmap.progress.map((item) => [
      item.day,
      item.topic,
      item.subtopic,
      item.link,
      `${item.duration} hrs`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`${selectedRoadmap.title}_Progress.pdf`);
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div>
          <h2>Learning Progress</h2>
          <p>Select roadmap to view structured learning plan</p>
        </div>

        <div className="header-controls">
  <select
    className="roadmap-select"
    value={selectedRoadmapId}
    onChange={(e) => setSelectedRoadmapId(e.target.value)}
  >
    {roadmaps.map((rm) => (
      <option key={rm._id} value={rm._id}>
        {rm.title}
      </option>
    ))}
  </select>

  <button className="download-btn" onClick={handleDownload}>
    Download PDF
  </button>
</div>
      </div>

      <div className="table-wrapper">
        <table className="progress-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Topic</th>
              <th>Subtopic</th>
              <th>Resource Link</th>
              <th>Duration (Hours)</th>
            </tr>
          </thead>
          <tbody>
            {selectedRoadmap.progress.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.topic}</td>
                <td>{item.subtopic}</td>
                <td>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    View Resource
                  </a>
                </td>
                <td>{item.duration} hrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Progress;