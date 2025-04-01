const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Ensure you're importing the correct project model
const Group = require('../models/Group');  // Assuming you still want to handle groups


// Route to fetch projects that need evaluation
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});


// Route to evaluate a project
router.put('/evaluate/:projectId', async (req, res) => {
  try {
    const { ideationScore, maturityScore, status } = req.body;
    const { projectId } = req.params;

    // Validate the incoming data
    if (typeof ideationScore !== "number" || typeof maturityScore !== "number" || !status) {
      return res.status(400).json({ error: "Invalid evaluation data" });
    }

    // Find the project by ID and update it with the evaluation data
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        ideationScore, 
        maturityScore,
        status,  // status should be one of 'pending', 'evaluated', or 'finalized'
      },
      { new: true } // Return the updated project
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("✅ Project evaluated:", project);
    res.json({
      message: "Project evaluated successfully",
      project,
    });
  } catch (error) {
    console.error('❌ Error evaluating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all groups with active sessions or logged-in status
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find({ isLoggedIn: true });
    console.log("Fetched groups:", groups); 
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to retrieve groups' });
  }
});

module.exports = router;
