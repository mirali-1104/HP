const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// Register Route
router.post("/register", async (req, res) => {
  const { teamName, institution, email, password, category, teamMembers } =
    req.body;

  console.log("\ud83d\udce5 Received data:", req.body);

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    // Ensure teamMembers is an array of objects { name, role }
    const formattedTeamMembers = Array.isArray(teamMembers)
      ? teamMembers.map(({ name, role }) => ({
          name: name.trim(),
          role: role.trim(),
        }))
      : [];

    const newStudent = new Student({
      teamName,
      institution,
      email,
      password,
      category,
      teamMembers: formattedTeamMembers,
    });

    await newStudent.save();
    console.log("\u2705 Student registered:", newStudent);

    res.status(201).json({ msg: "Registration successful." });
  } catch (err) {
    console.error("\ud83d\udea8 Registration Error:", err);
    res.status(500).json({ msg: "Server error." });
  }
});

// Student Login Route
router.post("/login", async (req, res) => {
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
      user: {
        _id: student._id,
        email: student.email,
        name: student.teamName,
        members: student.teamMembers,
      },
    });
  } catch (err) {
    console.error("\ud83d\udea8 Student Login Error:", err);
    res.status(500).json({ msg: "Server error." });
  }
});

// Fetch Team by Email
router.get("/team/:email", async (req, res) => {
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
