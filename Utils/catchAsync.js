module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    //fn(req,res,next).catch(err => next(err))
    //I'm questioning about this catch(next)
  };
};
//The catchAsync function is a higher-order function that takes in a callback function fn as its argument and returns a new function that expects the usual req, res and next parameters. The returned function executes the original callback fn with these parameters and then attaches a .catch() method to the resulting promise, passing the next parameter as the callback function to handle any errors.
// Thus, the catchAsync function is a convenient way to wrap async functions with error handling, instead of repeating the same try-catch block in multiple places.
// In the provided example, catchAsync is used to wrap the createTour async function to handle any errors thrown when creating a new tour using the Tour.create() method. Instead of using a try-catch block inside the createTour function, it simply uses the catchAsync function to pass any errors to the global error handler middleware via the next function.
