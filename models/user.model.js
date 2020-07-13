const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String,
    trim: true,
    required: true
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

UserSchema.methods.comparePassword = (password) => {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model('User', UserSchema);
