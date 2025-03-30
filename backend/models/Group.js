const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
  members: { type: [String], default: [] },
  projects: { type: [String], default: [] },
  isLoggedIn: { type: Boolean, default: false },
});

module.exports = mongoose.model('Group', GroupSchema);
