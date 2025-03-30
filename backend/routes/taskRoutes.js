const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// ✅ Fetch Tasks by User ID
router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ msg: "User ID is required" });

  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Create a New Task
router.post("/", async (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name)
    return res.status(400).json({ msg: "User ID and task name required" });

  try {
    const newTask = new Task({ userId, name, checked: false });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Update Task Status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { checked } = req.body;

  try {
    await Task.findByIdAndUpdate(id, { checked });
    res.json({ msg: "Task updated" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
