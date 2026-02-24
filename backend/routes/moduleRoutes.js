const express = require("express");
const router = express.Router();
const Module = require("../models/Module");

// GET all modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;