const logger = require('../utils/logger');

const handleCastErrorDB = (err) => ({
  statusCode: 400,
  message: `Invalid ${err.path}: ${err.value}`,
});

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  return {
    statusCode: 409,
    message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
  };
};

const handleValidationErrorDB = (err) => ({
  statusCode: 422,
  message: Object.values(err.errors).map((e) => e.message).join('. '),
});

const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Session expired. Please log in again.',
});

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;

  // Transform known error types
  if (err.name === 'CastError') ({ statusCode, message } = handleCastErrorDB(err));
  else if (err.code === 11000) ({ statusCode, message } = handleDuplicateFieldsDB(err));
  else if (err.name === 'ValidationError') ({ statusCode, message } = handleValidationErrorDB(err));
  else if (err.name === 'JsonWebTokenError') ({ statusCode, message } = handleJWTError());
  else if (err.name === 'TokenExpiredError') ({ statusCode, message } = handleJWTExpiredError());

  // Log server errors
  if (statusCode >= 500) {
    logger.error({ message: err.message, stack: err.stack, url: req.url, method: req.method });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;