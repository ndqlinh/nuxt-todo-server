const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
