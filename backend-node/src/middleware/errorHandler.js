export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (err.message === 'Not allowed by CORS') {
    status = 403;
    message = 'CORS policy violation';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'File too large';
  }

  // Don't expose error details in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal server error';
  } else if (process.env.NODE_ENV !== 'production') {
    // Include stack trace in development
    message = {
      error: err.message,
      stack: err.stack,
      ...(err.details && { details: err.details })
    };
  }

  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};