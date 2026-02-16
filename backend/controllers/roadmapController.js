exports.generateRoadmap = (req, res) => {
  const { educationLevel, targetField, experienceLevel, duration, goal } = req.body;

  // Temporary mock response
  res.json({
    message: "Roadmap generated successfully",
    inputReceived: {
      educationLevel,
      targetField,
      experienceLevel,
      duration,
      goal
    },
    roadmap: [
      { week: 1, topic: "Introduction & Fundamentals" },
      { week: 2, topic: "Core Concepts" },
      { week: 3, topic: "Intermediate Projects" },
      { week: 4, topic: "Advanced Topics & Capstone" }
    ]
  });
};
