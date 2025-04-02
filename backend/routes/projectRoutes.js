const express = require("express");
const router = express.Router();
const multer = require("multer");
const Project = require("../models/project");
const Student = require("../models/student");

const upload = multer({ dest: "uploads/" });

router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    console.log("📩 Project submission request received:", req.body);
    const {
      email,
      leaderName,
      projectName,
      description,
      technologies,
      elevatorPitch,
    } = req.body;

    if (!email || !leaderName || !projectName || !description) {
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
      leaderName,
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
          { leaderName: regex },
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

// ✅ Fetch projects by team name
router.get("/projects/team/:teamName", async (req, res) => {
  try {
    const { teamName } = req.params;
    const students = await Student.find({ teamName }, "email");
    const emails = students.map((student) => student.email);
    const projects = await Project.find({ email: { $in: emails } });

    res.json({ teamName, projects });
  } catch (error) {
    console.error("❌ Error fetching projects by team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/api/projects/:id", async (req, res) => {
  try {
      let project;
      
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          // If it's a valid ObjectId, search normally
          project = await Project.findById(req.params.id);
      } else {
          // If it's stored as a string, search by _id as a string
          project = await Project.findOne({ _id: req.params.id });
      }

      if (!project) {
          return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/results", async (req, res) => {
  try {
      // Fetch all projects with their scores
      const projects = await Project.find({}, "projectName teamName finalScore criteria").sort({ finalScore: -1 });

      if (!projects || projects.length === 0) {
          return res.status(404).json({ message: "No project results found" });
      }

      res.status(200).json(projects);
  } catch (error) {
      console.error("Error fetching project results:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
