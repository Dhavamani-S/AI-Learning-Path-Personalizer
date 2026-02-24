const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./db");
const Module = require("../models/Module");

dotenv.config();

// Sample Modules Data
const modules = [
  {
    title: "JavaScript Basics",
    description: "Learn variables, functions, loops, and arrays.",
    level: "Beginner",
  },
  {
    title: "Node.js Fundamentals",
    description: "Learn backend development with Node.js and Express.",
    level: "Intermediate",
  },
  {
    title: "MongoDB & Mongoose",
    description: "Learn database integration with MongoDB.",
    level: "Intermediate",
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await Module.deleteMany(); // Clear old data
    console.log("Old modules deleted");

    await Module.insertMany(modules); // Insert new data
    console.log("Modules seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();