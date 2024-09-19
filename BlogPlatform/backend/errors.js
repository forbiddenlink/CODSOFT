class AppError extends Error {
  constructor(message, statusCode) {
    super(message || 'Something went wrong'); // Default message if none is provided
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming bugs
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 4xx errors are 'fail', others 'error'
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400); // Bad Request
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401); // Unauthorized
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404); // Not Found
  }
}

class ServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500); // Internal Server Error
  }
}

// Export AppError along with the other errors
module.exports = { AppError, BadRequestError, UnauthorizedError, NotFoundError, ServerError };
