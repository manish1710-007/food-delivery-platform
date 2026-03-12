module.exports = (err, req, res, next) => {
  // Log the raw error to the terminal for the sysadmin
  console.error(`\n[SYS.CRITICAL] 🚨 FATAL EXCEPTION DETECTED`);
  console.error(`[ROUTE] ${req.method} ${req.originalUrl}`);
  console.error(`[DETAILS]`, err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `[INVALID_DATA] Resource ID format rejected by the mainframe.`;
    error = new Error(message);
    error.status = 404;
  }

  // Mongoose Duplicate Key (Code 11000)
  if (err.code === 11000) {
    const message = `[CONFLICT] Duplicate data entry detected in the registry.`;
    error = new Error(message);
    error.status = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(`[VALIDATION_FAILED] ${message}`);
    error.status = 400;
  }

  // Final Output to Client
  const statusCode = error.status || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || '[SYS.ERR] Internal Mainframe Failure',
  
    stack: process.env.NODE_ENV === 'production' ? 'CLASSIFIED_IN_PRODUCTION' : err.stack
  });
};