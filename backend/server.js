const express = require("express");
const cors = require("cors");
const roadmapRoutes = require("./routes/roadmapRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/roadmap", roadmapRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});