const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  email: { type: String, required: true },
  leaderName: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  elevatorPitch: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent OverwriteModelError
module.exports =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
