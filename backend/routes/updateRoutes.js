const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Update User Route
router.post('/update', async (req, res) => {
  console.log(req.body);
  const { email, name, role, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Update user fields if provided
    if (name) user.name = name;
    if (role) user.role = role;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    console.log('Update Successful');

    res.json({
      message: 'Update Successful',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
