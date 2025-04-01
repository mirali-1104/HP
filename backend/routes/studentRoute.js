const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// ✅ Fetch a student by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      // Fetch a single student by email
      const student = await Student.findOne(
        { email },
        "_id teamName email teamMembers projectSubmitted"
      );

      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      const userDetails = student.teamMembers.find(
        (member) => member.email === email
      ) || { name: "Unknown", role: "Unknown" };

      res.json({
        userId: student._id,
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
    } else {
      // Fetch all students
      const students = await Student.find(
        {},
        "_id userId teamName institution category email teamMembers projectSubmitted registeredAt"
      );

      res.json(students);
    }
  } catch (error) {
    console.error("Error fetching students:", error);
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
