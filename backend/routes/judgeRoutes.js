const express = require("express");
const router = express.Router();
const Project = require("../models/project");

// Fetch all pending projects
router.get("/projects/pending", async (req, res) => {
  try {
    const projects = await Project.find({ finalStatus: "pending" });
    res.json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// Fetch a specific project by ID
router.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!id || id.length !== 24) {
        return res.status(400).json({ error: "Invalid project ID" });
    }

    // Fetch project from MongoDB
    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    // Return all project data, including additional fields
    res.json({
      projectName: project.projectName,
      leaderName: project.leaderName,
      email: project.email,
      description: project.description,
      elevatorPitch: project.elevatorPitch,
      technologies: project.technologies,
      fileUrl: project.fileUrl,
      ideationScore: project.ideationScore,
      modularityScore: project.modularityScore,
      finalStatus: project.finalStatus,
      comments: project.comments,
      createdAt: project.createdAt,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Evaluate a project
router.put("/projects/evaluate/:id", async (req, res) => {
  try {
    const { ideationScore, modularityScore, comments } = req.body;
    const { id } = req.params;

    // Validate inputs
    if (typeof ideationScore !== "number" || typeof modularityScore !== "number") {
      return res.status(400).json({ error: "Scores must be numbers" });
    }

    // Update project evaluation
    const project = await Project.findByIdAndUpdate(
      id,
      {
        ideationScore,
        modularityScore,
        comments,
        finalStatus: "evaluated",
      },
      { new: true }
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    console.log("✅ Project evaluated:", project);
    res.json({ message: "Evaluation submitted successfully", project });
  } catch (error) {
    console.error("❌ Error evaluating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching project with ID:", id);  // Log incoming request

    // Check if ID is valid
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("Found project:", project);  // Log fetched project data
    res.json(project);  // Return project details

  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
