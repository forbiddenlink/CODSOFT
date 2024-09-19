const { createLogger, format, transports } = require('winston');

// Custom log format
const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Determine log level based on environment
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Create a logger instance
const logger = createLogger({
  level: logLevel, // Use environment-based log levels
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Log the stack trace for errors
    customFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize console logs
        customFormat
      )
    }),
    new transports.File({ filename: 'logs/app.log', level: 'info' }), // General logs
    new transports.File({ filename: 'logs/error.log', level: 'error' }) // Error-specific logs
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }) // Handle uncaught exceptions
  ]
});

// Export the logger
module.exports = logger;
