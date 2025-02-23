require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 }
  });

const User = mongoose.model('User', UserSchema);

// Login Route
app.post('/login', async (req, res) => {
  console.log("Attempting Log In")
  console.log(req.body);
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, message: 'Login successful' });
});

// Register Route (for new users)
app.post('/register', async (req, res) => {
  console.log("Attempting Register");
  console.log(req.body);
  const { email, password } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("FAILED: Email Already Registered")
    return res.status(400).json({ message: 'Email already Registered' });
  }

  // Proceed with registration if email doesn't exist
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  console.log("Sussessful Register");
  res.json({ message: 'User registered successfully' });
});


app.listen(5000, () => console.log('Server running on port 5000'));
