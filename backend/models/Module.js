const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    level: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);