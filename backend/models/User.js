const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, //PK
  name: { type: String, required: false }, // Add name field
  password: { type: String, required: true},
  role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user', required: true }, // Add role field
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const User = mongoose.model('User', UserSchema);
module.exports = User;
