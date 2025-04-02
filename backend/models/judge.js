const mongoose = require("mongoose");

const JudgeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
});

// ✅ Prevent OverwriteModelError
const Judge =
  mongoose.models.Judge || mongoose.model("Judge", JudgeSchema, "Judge");

module.exports = Judge;
