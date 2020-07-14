const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  hash: {
    type: String,
    trim: true,
    required: true
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.hash
  }
});

module.exports = mongoose.model('User', UserSchema);
