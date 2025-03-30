const express = require('express');
const router = express.Router();
const Student = require('../models/student');


router.post('/register', async (req, res) => {
  const { teamName, institution, email, password, category, teamMembers } = req.body;

  console.log("📥 Received data:", req.body);

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    const formattedTeamMembers = Array.isArray(teamMembers)
      ? teamMembers.map(member => member.trim()) 
      : teamMembers.split(",").map(member => member.trim());

    const newStudent = new Student({
      teamName,
      institution,
      email,
      password,
      category,
      teamMembers: formattedTeamMembers 
    });

    await newStudent.save();
    console.log("✅ Student registered:", newStudent);

    res.status(201).json({ msg: "Registration successful." });
  } catch (err) {
    console.error("🚨 Registration Error:", err);
    res.status(500).json({ msg: "Server error." });
  }
});

// Student Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ msg: "Invalid email." });
    }

    if (student.password !== password) {
      return res.status(401).json({ msg: "Incorrect password." });
    }

    res.json({
      token: "dummy_token_student",
      user: { email: student.email, name: student.teamName }
    });
  } catch (err) {
    console.error("🚨 Student Login Error:", err);
    res.status(500).json({ msg: "Server error." });
  }
});

router.get('/team/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const team = await Student.findOne({ email });

    if (!team) {
      return res.status(404).json({ msg: "Team not found." });
    }

    res.json(team);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ msg: "Server error." });
  }
});

module.exports = router;
