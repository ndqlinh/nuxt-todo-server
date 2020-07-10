const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  email: String,
  is_active: { type: Boolean, default: false },
  is_deactive: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
