const express = require("express");
const router = express.Router(); 
const multer = require("multer");
const Project = require("../models/project");
const Student = require("../models/student"); 

const upload = multer({ dest: "uploads/" });

router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    console.log("📩 Project submission request received:", req.body);
    const { email, projectName, description, technologies, elevatorPitch } =
      req.body;

    if (!email || !projectName || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingProject = await Project.findOne({ email });
    if (existingProject) {
      console.log("⚠️ Project already exists for this email:", email);
      return res
        .status(400)
        .json({ error: "You have already submitted the project. Thank You!!" });
    }

    const techArray = technologies ? technologies.split(",") : [];

    const newProject = new Project({
      email,
      projectName,
      description,
      technologies: techArray,
      elevatorPitch,
      fileUrl: req.file ? req.file.path : null,
    });

    await newProject.save();

    const student = await Student.findOne({ email });

    if (!student) {
      console.log("⚠️ No student found with email:", email);
      return res.status(404).json({ error: "Student not found" });
    }

    student.projectSubmitted = true;
    await student.save();

    console.log("✅ Project submitted successfully:", newProject);
    res.status(201).json({
      message: "Project submitted successfully",
      project: newProject,
      student,
    });
  } catch (error) {
    console.error("❌ Error submitting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        $or: [
          { projectName: regex },
          { email: regex },
          { technologies: { $in: [regex] } },
        ],
      };
    }

    const projects = await Project.find(query);
    res.json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
