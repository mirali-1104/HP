require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");

const adminAuthRoutes = require("./routes/adminAuth");
const judgeAuthRoutes = require("./routes/judgeAuth");
const studentAuthRoutes = require("./routes/studentAuth");
const judgeRoutes = require("./routes/judgeRoutes");  // Updated to import judgeRoutes properly
const submitProjectRoute = require("./routes/submitProject");
const taskRoutes = require("./routes/taskRoutes");
const studentRoutes = require("./routes/studentRoute");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
  

const uploadFolder = path.join(__dirname, "uploads"); // Ensure correct path

app.get("/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.resolve(uploadFolder, fileName); // Ensure absolute path

  console.log("Requested file:", filePath); // Debugging log

  if (fs.existsSync(filePath)) {
    res.download(filePath); // Send the file
  } else {
    console.error("File not found:", filePath); // Debugging log
    res.status(404).send("File not found");
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/admin", adminAuthRoutes);
app.use("/api/judge", judgeAuthRoutes);
app.use("/api/judge", judgeRoutes);  // Routes prefixed with /api/judge
app.use("/api/student", studentAuthRoutes);
app.use("/api/user", submitProjectRoute);
app.use("/api/tasks", taskRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api", require("./routes/projectRoutes"));
app.use("/api", judgeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
