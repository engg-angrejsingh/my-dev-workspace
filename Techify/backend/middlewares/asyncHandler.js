// asyncHandler is a wrapper function used to handle errors in async route controllers
// It prevents the need to write try/catch blocks in every controller
const asyncHandler = (fn) => (req, res, next) => {

  // Promise.resolve ensures the function result is treated as a promise
  // This allows both async and non-async functions to be handled the same way
  Promise.resolve(fn(req, res, next)).catch((error) => {

    // Check if the response has already been sent to the client
    // If headers were already sent, we cannot modify the response
    if (!res.headersSent) {

      // If the controller already set a status code (like 404 or 401),
      // keep it. Otherwise default to 500 (internal server error)
      const status = res.statusCode !== 200 ? res.statusCode : 500;

      // Send a JSON response containing the error message
      res.status(status).json({
        message: error.message
      });
    }
  });
};

// Export the asyncHandler so it can be used in route controllers
export default asyncHandler;