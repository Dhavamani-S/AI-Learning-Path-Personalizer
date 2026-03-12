const express = require("express");
const router = express.Router();
const {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  completeDay,
  deleteRoadmap,
} = require("../controllers/roadmapController");
const { protect } = require("../middleware/authMiddleware");

// ✅ All routes protected — user must be logged in
router.post("/generate", protect, generateRoadmap);       // Generate roadmap
router.get("/", protect, getUserRoadmaps);                // Get all user roadmaps
router.get("/:id", protect, getRoadmapById);              // Get single roadmap
router.put("/:id/complete/:day", protect, completeDay);   // Mark day complete
router.delete("/:id", protect, deleteRoadmap);            // Delete roadmap

module.exports = router;