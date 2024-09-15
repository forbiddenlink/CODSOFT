const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const { BadRequestError, UnauthorizedError } = require('./errors.js');
const errorHandler = require('./errorHandler.js');
const Post = require('./models/Post');
const User = require('./models/User');
const Comment = require('./models/Comment');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in your .env file');
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Middleware to protect routes
const authMiddleware = (role) => (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied. Invalid token.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    if (role && req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes should be defined *before* the catch-all route for index.html

// Get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving posts' });
  }
});

// Add a comment to a post
app.post('/api/posts/:id/comments', authMiddleware('Viewer'), [
  body('comment').isLength({ min: 1 }).withMessage('Comment cannot be empty'),
], async (req, res, next) => {
  const postId = req.params.id;
  const { comment } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = new Comment({
      postId,
      comment,
      userId: req.user._id,
      username: req.user.username,
    });

    await newComment.save();
    res.status(201).send(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Error saving comment' });
  }
});

// Get all comments for a specific post
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving comments' });
  }
});

// User Profile Routes
app.get('/api/profile', authMiddleware(), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// Registration route with validation
app.post('/api/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password').isStrongPassword().withMessage('Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one symbol'),
  body('role').isIn(['Viewer', 'Editor', 'Admin']).withMessage('Invalid role'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed' });
  }

  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    next(err);
  }
});

// Login route with additional error handling and logging
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt with username:', username);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = generateAccessToken(user);
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (err) {
    next(err);
  }
});

// Error Handling Middleware
app.use(errorHandler);

// Catch-all route to serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html')); // Correct path for your `index.html` in the frontend folder
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
