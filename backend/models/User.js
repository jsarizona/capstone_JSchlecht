
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user', required: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;