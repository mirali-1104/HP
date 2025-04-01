const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  email: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  elevatorPitch: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  ideationScore: { type: Number, min: 0, max: 10, default: 0 }, // Score for ideation (0-10)
  modularityScore: { type: Number, min: 0, max: 10, default: 0 }, // Score for modularity (0-10)
  finalStatus: { 
    type: String, 
    enum: ["pending", "evaluated", "finalized"], 
    default: "pending" 
  }, // Status after evaluation
  comments: { type: String, default: "" }, // Optional comments/feedback from the judge
});


// Prevent OverwriteModelError
module.exports =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
