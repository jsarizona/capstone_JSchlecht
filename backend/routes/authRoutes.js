const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Attempting Log In');
  // Send both the token and the user data in the response
  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
      role: user.role, // make sure to include the role if needed
    },
    message: 'Login successful'
  });
  console.log('LoginSuccessfull');
});

// Register Route
router.post('/register', async (req, res) => {
  console.log('Attempting Register');
  console.log(req.body);
  const { email, password } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('FAILED: Email Already Registered');
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Proceed with registration
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  console.log('Successful Register');
  res.json({ message: 'User registered successfully' });
});

// Google Login Route
router.post('/google-login', async (req, res) => {
  try {
    console.log("Accessing /google-login")
    const { token } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token, // Note: use `idToken` not `accessToken` if you're sending from frontend
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });

    // If user doesn't exist, create it
    if (!user) {
      user = new User({ email, name, password: 'google_oauth', role: 'user' }); // dummy password
      await user.save();
    }

    // Create JWT token for our backend
    const jwtToken = jwt.sign({ id: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      token: jwtToken,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Google login successful',
    });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
});

module.exports = router;
