require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Editor', 'Viewer'] }
});

const User = mongoose.model('User', userSchema);

// Define Comment schema and model
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    date: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
});

const Comment = mongoose.model('Comment', commentSchema);

// Define Post schema and model
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// Middleware to protect routes (Authorization)
const authMiddleware = (role) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).send('Access Denied');

        const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
        if (!token) return res.status(401).send('Access Denied');

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;

            if (role && req.user.role !== role) {
                return res.status(403).send('You do not have the required permissions');
            }

            next();
        } catch (err) {
            res.status(400).send('Invalid token');
        }
    };
};

// Registration route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid username or password');

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send('Invalid username or password');

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully', token: token });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to create a new blog post
app.post('/api/posts', authMiddleware('Editor'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newPost = new Post({ title, content, author });
        await newPost.save();
        res.status(201).send(newPost);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to get all blog posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to get a single blog post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        res.status(200).send(post);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to create a new comment
app.post('/api/posts/:id/comments', authMiddleware(), async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;
        const username = req.user._id; // Assuming you store the username in the token

        const newComment = new Comment({ content, username, postId });
        await newComment.save();

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to get comments for a specific post
app.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to update a blog post
app.put('/api/posts/:id', authMiddleware('Editor'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, author },
            { new: true }
        );
        if (!updatedPost) return res.status(404).send('Post not found');
        res.status(200).send(updatedPost);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to delete a blog post
app.delete('/api/posts/:id', authMiddleware('Admin'), async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).send('Post not found');
        res.status(200).send('Post deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
