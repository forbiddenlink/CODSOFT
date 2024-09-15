const { createLogger, format, transports } = require('winston');

// Custom log format
const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat // Use custom format
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: 'logs/app.log' }) // Logs to file
  ],
});

// Export the logger
module.exports = logger;
