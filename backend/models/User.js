const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ✅ Basic Auth Fields
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ✅ Learning Preferences (filled when user submits Home form)
    education: {
      type: String,
      default: "",
    },
    targetField: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      enum: ["", "Beginner", "Intermediate", "Advanced"],
      default: "",
    },
    duration: {
      type: Number, // in months
      default: null,
    },
    masteryLevel: {
      type: String,
      enum: ["", "Basic", "Professional", "Expert"],
      default: "",
    },
    description: {
      type: String,
      default: "",
    },

    // ✅ Auth Type (to differentiate Google vs normal users)
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);