const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Trim whitespace
        minlength: 5, // Minimum length for the title
    },
    content: {
        type: String,
        required: true,
        trim: true, // Trim whitespace
        minlength: 20, // Minimum length for the content
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
