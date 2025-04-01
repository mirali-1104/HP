const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// ✅ Fetch a student by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ✅ Find student by email
    const student = await Student.findOne(
      { email },
      "_id teamName email teamMembers projectSubmitted"
    );

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // ✅ Log the fetched student data
    console.log("Fetched student data:", student);

    // ✅ Extract name and role from teamMembers
    const userDetails = student.teamMembers.find(
      (member) => member.email === email
    ) || { name: "Unknown", role: "Unknown" };

    // ✅ Log the projectSubmitted status
    console.log("Project Submitted Status:", student.projectSubmitted);

    // ✅ Return only one response
    res.json({
      userId: student._id, // ✅ Ensure the ID is included
      email: student.email,
      teamName: student.teamName,
      teamMembers: student.teamMembers.map((member) => ({
        name: member.name,
        role: member.role,
      })),
      name: userDetails.name,
      role: userDetails.role,
      submissionStatus: student.projectSubmitted
        ? "Submitted"
        : "Not Submitted",
      deadline: "Not set by Admin",
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update Student Data
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating student with ID:", id); // Debugging Log

    const student = await Student.findById(id);
    if (!student) {
      console.log("Student not found for ID:", id); // Debugging Log
      return res.status(404).json({ msg: "Student not found" });
    }

    // ✅ Update only provided fields
    const { email, password, teamName, teamMembers } = req.body;
    if (email) student.email = email;
    if (password) student.password = password; // Ensure it's hashed if needed
    if (teamName) student.teamName = teamName;
    if (teamMembers) student.teamMembers = teamMembers;

    await student.save();
    console.log("Profile updated successfully:", student); // Debugging Log
    res.json({ msg: "Profile updated successfully", student });
  } catch (err) {
    console.error("Error updating profile:", err); // Debugging Log
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
