const mongoose = require("mongoose");

// ✅ Resource Schema (YouTube + Article links per module)
const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["youtube", "article"],
  },
  title: { type: String, default: "" },
  url: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  source: { type: String, default: "" }, // "YouTube" or "Google"
});

// ✅ Module Schema (each row in the table)
const moduleSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  topic: { type: String, required: true },
  subtopic: { type: String, required: true },
  duration: { type: String, default: "1-2 hrs" }, // e.g. "2 hrs"
  resources: [resourceSchema],                     // YouTube + article links
  isCompleted: { type: Boolean, default: false },
});

// ✅ Main Roadmap Schema
const roadmapSchema = new mongoose.Schema(
  {
    // ✅ Link to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ User inputs that generated this roadmap
    targetField: { type: String, required: true },
    education: { type: String, default: "" },
    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    duration: { type: Number, required: true }, // in months
    masteryLevel: {
      type: String,
      enum: ["Basic", "Professional", "Expert"],
      required: true,
    },
    description: { type: String, default: "" },

    // ✅ Generated roadmap data
    totalDays: { type: Number, required: true },
    modules: [moduleSchema],

    // ✅ Progress tracking
    completedDays: { type: [Number], default: [] },
    percentageComplete: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);