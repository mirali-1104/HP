// routes/judgeAuth.js
const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(`🔍 Searching for Judge email: ${email}`);

  try {
    const judge = await Judge.findOne({ email: email.trim() });
    console.log("🗃️ Judge data from DB:", judge);

    if (!judge) {
      console.log("❌ No Judge found with that email.");
      return res.status(401).json({ msg: "Invalid email." });
    }

    if (judge.password !== password) {
      console.log("❌ Password mismatch!");
      return res.status(401).json({ msg: "Invalid password." });
    }

    console.log("✅ Judge logged in successfully!");

    return res.json({
      token: "dummy_token_judge",
      user: { email: judge.email, name: judge.name }
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({ msg: "Server error." });
  }
});

module.exports = router;
