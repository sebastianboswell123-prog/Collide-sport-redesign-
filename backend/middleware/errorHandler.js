function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}`, err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
