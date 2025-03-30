const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// ✅ Fetch all students or a student by email if provided
router.get("/", async (req, res) => {
  const { email } = req.query;

  if (email) {
    try {
      const student = await Student.findOne({ email });
      if (!student) return res.status(404).json({ msg: "Student not found" });
      return res.json(student);
    } catch (err) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
  } else {
    try {
      const students = await Student.find();
      return res.json(students);
    } catch (err) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
});

// ✅ Update Student Data
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password, teamName, teamMembers } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    // Update fields if provided
    if (email) student.email = email;
    if (password) student.password = password; // Hash password if needed
    if (teamName) student.teamName = teamName;
    if (teamMembers) student.teamMembers = teamMembers;

    await student.save();
    res.json({ msg: "Profile updated successfully", student });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
