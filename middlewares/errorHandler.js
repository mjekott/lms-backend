const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message,
  });
};

module.exports = errorHandler;
