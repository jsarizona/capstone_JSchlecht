const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const crypto = require('crypto');

const router = express.Router();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD, // app password, NOT your Gmail password
  },
});
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
      role: user.role,
      emailVerified: user.emailVerified 
    },
    message: 'Login successful'
  });
  console.log('LoginSuccessfull');
  console.log(user.emailVerified)
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const newUser = new User({
    email,
    name,
    password: hashedPassword,
    emailVerificationToken,
    emailVerified: false
  });

  await newUser.save();

  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${emailVerificationToken}&email=${email}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Verify your email',
    html: `<p>Please click the link to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`
  });

  res.json({ message: 'Registration successful. Check your email to verify.' });
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
        emailVerified: user.emailVerified
      },
      message: 'Google login successful',
    });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token, email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send('Invalid link');
    if (user.emailVerified) return res.send('Email already verified');
    if (user.emailVerificationToken !== token) return res.status(400).send('Invalid or expired token');

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.send('Email verified successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying email');
  }
});

router.post('/reverify-email', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.emailVerified) {
      return res.status(200).json({
        message: 'Email is already verified.',
        verified: true,
      });
    }

    // Generate a new token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${emailVerificationToken}&email=${email}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Resend Email Verification',
      html: `<p>You requested to verify your email again:</p><a href="${verificationUrl}">Verify Email</a>`,
    });

    res.status(200).json({
      message: 'Verification email resent. Please check your inbox.',
      verified: false,
    });

  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Error resending verification email' });
  }
});




module.exports = router;
