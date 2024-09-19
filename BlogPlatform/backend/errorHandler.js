const { AppError } = require('./errors.js');

// Improved error handler
const errorHandler = (err, req, res, next) => {
  // In case of custom AppError, return the appropriate status and message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
    });
  }

  // Handle Mongoose cast errors (e.g., invalid objectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Log errors for internal debugging in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  }

  // Handle general server errors
  console.error('Unexpected Error:', err); // Always log the error

  // Send generic response in production to avoid exposing sensitive info
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
};

module.exports = errorHandler;
