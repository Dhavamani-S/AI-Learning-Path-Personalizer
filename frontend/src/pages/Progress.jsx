import React from "react";
import "./Progress.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Progress = () => {
  const progressData = [
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
    {
      day: "Day 3",
      topic: "JavaScript",
      subtopic: "Variables & Functions",
      link: "https://example.com/js",
      duration: 4,
    },
  ];

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Learning Progress Report", 14, 20);

    const tableColumn = [
      "Day",
      "Topic",
      "Subtopic",
      "Resource Link",
      "Duration (Hours)",
    ];

    const tableRows = progressData.map((item) => [
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
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    doc.save("Learning_Progress_Report.pdf");
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div>
          <h2>Learning Progress</h2>
          <p>Daily structured learning plan overview</p>
        </div>

        <button className="download-btn" onClick={handleDownload}>
          Download PDF
        </button>
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
            {progressData.map((item, index) => (
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
