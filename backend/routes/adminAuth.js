const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Received email:", email);
  console.log("Received password:", password);

  try {
    const admin = await Admin.findOne({ email });
    console.log("Admin from DB:", admin);

    if (!admin) {
      console.log("No admin found with that email.");
      return res.status(401).json({ msg: "Invalid email." });
    }

    if (admin.password !== password) {
      console.log("Password mismatch. Expected:", admin.password);
      return res.status(401).json({ msg: "Incorrect password" });
    }

    console.log("✅ Credentials match!");

    return res.json({
      token: "dummy_token_admin",
      user: { email: admin.email, name: admin.name }
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
