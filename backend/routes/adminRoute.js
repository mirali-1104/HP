const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Admin = require("../models/admin");
const Student = require("../models/student"); 
const Projects = require("../models/project"); 
const Judge = require("../models/judge"); 

// Get Admin Details
router.get("/admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Admin Details
router.put("/update-admin/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminId = req.params.id;

    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prepare update data
    const updateData = { name, email };

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update admin details in the database
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "✅ Admin details updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch total students (previously `total-teams`)
// Fetch total students from Student collection
router.get("/total-students", async (req, res) => {
  try {
    const studentsCount = await Student.countDocuments(); // Corrected model reference
    res.json({ totalStudents: studentsCount });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/total-projects", async (req, res) => {
  try {
    const projectCount = await Projects.countDocuments(); // Corrected model reference
    res.json({ totalProjects: projectCount }); // Corrected key from totalStudents to totalProjects
  } catch (error) {
    console.error("Error fetching project count:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/total-judge", async (req, res) => {
  try {
    const projectCount = await Judge.countDocuments();
    res.json({ totalJudge: projectCount });
  } catch (error) {
    console.error("Error fetching judge count:", error);
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = router;
