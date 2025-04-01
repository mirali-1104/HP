const express = require("express");
const router = express.Router();
const Project = require("../models/project"); // Ensure correct import

// Fetch all pending projects
router.get("/api/projects/pending", async (req, res) => {
  try {
    const projects = await Project.find({ finalStatus: "pending" });
    res.json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// Fetch a specific project by ID
router.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    res.status(500).json({ error: "Error fetching project details" });
  }
});

// Evaluate a project
router.put("/api/projects/evaluate/:id", async (req, res) => {
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

module.exports = router;
