// Define a custom error class named 'AppError' that extends the built-in 'Error' class
class AppError extends Error {
  // Define the constructor method, which takes in a 'message' and a 'statusCode'
  constructor(message, statusCode) {
    // Call the parent constructor method and pass in the 'message'
    super(message);

    // Set the 'statusCode' and 'status' properties based on the passed in 'statusCode'
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace of the error by calling the built-in 'Error.captureStackTrace()' method
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
