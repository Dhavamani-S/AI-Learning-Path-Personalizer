const express = require("express");
const router = express.Router();
const { generateRoadmap } = require("../controllers/roadmapController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, generateRoadmap);

module.exports = router;
