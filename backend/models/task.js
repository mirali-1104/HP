const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  name: String,
  checked: Boolean,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
