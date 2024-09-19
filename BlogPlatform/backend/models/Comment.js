const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  comment: { 
    type: String, 
    required: true, 
    trim: true, // Trim whitespace
    minlength: 3 // Ensure minimum length for comments
  }
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
