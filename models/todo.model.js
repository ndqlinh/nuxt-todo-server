const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
  name: String,
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);
