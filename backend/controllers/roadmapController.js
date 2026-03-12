// ✅ Roadmap Controller
const Roadmap = require("../models/Roadmap");
const generateRoadmap = require("../ai/roadmapGenerator");
const { fetchResourcesForModules } = require("../ai/resourceFetcher");

// ═══════════════════════════════════════
// 🔹 GENERATE ROADMAP
// POST /api/roadmap/generate
// ═══════════════════════════════════════
exports.generateRoadmap = async (req, res) => {
  try {
    const {
      education,
      targetField,
      experience,
      duration,
      masteryLevel,
      description,
    } = req.body;

    // ✅ Validate required fields
    if (!targetField || !experience || !duration || !masteryLevel) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const userId = req.user;

    // ✅ Delete existing roadmap for same field
await Roadmap.deleteOne({ userId, targetField, experience });
    // ✅ Step 1-3: Run AI Engine
    const { totalDays, modules } = await generateRoadmap({
      education,
      targetField,
      experience,
      duration: Number(duration),
      masteryLevel,
      description,
    });

    // ✅ Step 4: Fetch YouTube + Google resources for each module
    console.log("Fetching resources for modules...");
    const modulesWithResources = await fetchResourcesForModules(modules, experience);
    console.log("Resources fetched successfully!");

    // ✅ Save roadmap to MongoDB
    const roadmap = await Roadmap.create({
      userId,
      education,
      targetField,
      experience,
      duration: Number(duration),
      masteryLevel,
      description,
      totalDays,
      modules: modulesWithResources,
    });

    res.status(201).json({
      message: "Roadmap generated successfully!",
      roadmap,
    });

  } catch (error) {
  console.error("Roadmap generation error:", error.message);

  if (error.message === "QUOTA_EXCEEDED") {
    return res.status(503).json({
      message: "AI service quota exceeded for today. Please try again tomorrow, or try a known domain like 'Web Development' or 'Data Science'."
    });
  }

  if (error.message?.includes("Failed to generate topics")) {
    return res.status(503).json({
      message: "AI service is temporarily unavailable. Please try again in a few minutes."
    });
  }

  res.status(500).json({ message: "Failed to generate roadmap." });
}
};

// ═══════════════════════════════════════
// 🔹 GET USER'S ROADMAPS
// GET /api/roadmap/
// ═══════════════════════════════════════
exports.getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.user;
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });

    if (!roadmaps || roadmaps.length === 0) {
      return res.status(404).json({ message: "No roadmaps found." });
    }

    res.json(roadmaps);
  } catch (error) {
    console.error("Get roadmaps error:", error.message);
    res.status(500).json({ message: "Failed to fetch roadmaps." });
  }
};

// ═══════════════════════════════════════
// 🔹 GET SINGLE ROADMAP BY ID
// GET /api/roadmap/:id
// ═══════════════════════════════════════
exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found." });
    }

    if (roadmap.userId.toString() !== req.user.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }

    res.json(roadmap);
  } catch (error) {
    console.error("Get roadmap error:", error.message);
    res.status(500).json({ message: "Failed to fetch roadmap." });
  }
};

// ═══════════════════════════════════════
// 🔹 MARK DAY AS COMPLETE
// PUT /api/roadmap/:id/complete/:day
// ═══════════════════════════════════════
exports.completeDay = async (req, res) => {
  try {
    const { id, day } = req.params;
    const dayNumber = Number(day);

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found." });
    }

    if (!roadmap.completedDays.includes(dayNumber)) {
      roadmap.completedDays.push(dayNumber);
    }

    roadmap.modules = roadmap.modules.map((mod) => {
      if (mod.day === dayNumber) mod.isCompleted = true;
      return mod;
    });

    roadmap.percentageComplete = Math.round(
      (roadmap.completedDays.length / roadmap.totalDays) * 100
    );

    await roadmap.save();

    res.json({
      message: `Day ${dayNumber} marked as complete!`,
      percentageComplete: roadmap.percentageComplete,
      roadmap,
    });
  } catch (error) {
    console.error("Complete day error:", error.message);
    res.status(500).json({ message: "Failed to update progress." });
  }
};

// ═══════════════════════════════════════
// 🔹 DELETE ROADMAP
// DELETE /api/roadmap/:id
// ═══════════════════════════════════════
exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found." });
    }

    if (roadmap.userId.toString() !== req.user.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }

    await roadmap.deleteOne();
    res.json({ message: "Roadmap deleted successfully." });
  } catch (error) {
    console.error("Delete roadmap error:", error.message);
    res.status(500).json({ message: "Failed to delete roadmap." });
  }
};