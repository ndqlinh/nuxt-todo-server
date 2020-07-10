const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
  name: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);
