const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Leader's email
  leaderName: { type: String, required: true }, // Leader's name
  projectName: { type: String, required: true }, // Name of the project
  description: { type: String, required: true }, // Description of the project
  technologies: { type: [String], required: true }, // Technologies used in the project
  elevatorPitch: { type: String, required: true }, // Elevator pitch for the project
  fileUrl: { type: String, required: true }, // URL to access the project file
  createdAt: { type: Date, default: Date.now }, // Date when the project was created

  // Evaluation-related fields
  ideationScore: { 
    type: Number, 
    min: 0, 
    max: 10, 
    default: 0 
  }, // Score for ideation (0-10)
  
  modularityScore: { 
    type: Number, 
    min: 0, 
    max: 10, 
    default: 0 
  }, // Score for modularity (0-10)

  // New field added to store evaluation status
  finalStatus: { 
    type: String, 
    enum: ["pending", "evaluated", "finalized"], 
    default: "pending" 
  }, // Status of the evaluation

  // Comments from the judge after evaluation
  comments: { type: String, default: "" }, // Optional feedback from the judge

  // New field to track the evaluation date (for record keeping)
  evaluatedAt: { type: Date, default: null }, // Date when the project was evaluated

});

// Prevent OverwriteModelError (i.e., if the model already exists, use it)
module.exports =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
