const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], default: 'Viewer' },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  
  if (!user.isModified('password')) return next(); // Only hash if the password is modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    user.password = await bcrypt.hash(user.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err); // Handle error
  }
});

// Instance method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
