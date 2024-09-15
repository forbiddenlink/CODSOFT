class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming bugs
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400); // Bad Request
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401); // Unauthorized
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404); // Not Found
  }
}

class ServerError extends AppError {
  constructor(message) {
    super(message, 500); // Internal Server Error
  }
}

// Export AppError along with the other errors
module.exports = { AppError, BadRequestError, UnauthorizedError, NotFoundError, ServerError };
