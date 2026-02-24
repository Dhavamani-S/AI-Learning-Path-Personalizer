const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const moduleRoutes = require("./routes/moduleRoutes");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/modules", moduleRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});