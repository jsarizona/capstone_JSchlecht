const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Fetch Users Route (using POST method)
router.post('/getusers', async (req, res) => {
  console.log("reached /api/users");

  try {
    const users = await User.find();  // Fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
