/**
 * Wraps an async function to catch any errors and pass them to Express's error handling middleware
 * @param {Function} fn - The async controller function to wrap
 * @returns {Function} A middleware function that handles errors
 */
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
