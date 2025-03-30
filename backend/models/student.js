const mongoose = require("mongoose");

// Prevent OverwriteModelError for Counter model
const Counter =
  mongoose.models.Counter ||
  mongoose.model(
    "Counter",
    new mongoose.Schema({
      name: { type: String, required: true, unique: true },
      seq: { type: Number, default: 1 },
    })
  );

// Student Schema
const StudentSchema = new mongoose.Schema({
  userId: { type: Number, unique: true }, // Auto-increment userId
  teamName: { type: String, required: true },
  institution: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: { type: String, required: true },
  teamMembers: [{ type: String }],
  registeredAt: { type: Date, default: Date.now },
  projectSubmitted: { type: Boolean, default: false },
});

// Pre-save Hook for Auto-incrementing userId
StudentSchema.pre("save", async function (next) {
  if (!this.userId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "studentId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Prevent OverwriteModelError for Student model
const Student =
  mongoose.models.Student ||
  mongoose.model("Student", StudentSchema, "Students");

module.exports = Student;
