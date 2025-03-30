const mongoose = require('mongoose');

const JudgeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' }
});

module.exports = mongoose.model('Judge', JudgeSchema, 'Judge');
