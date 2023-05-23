const AppError = require('./../Utils/appError');
const { CastError } = require('mongoose');

const handleCastErrorDB = (err) => {
  const message = `invaild ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name} . Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJwtError = () =>
  new AppError('the token you input not correct. please login again', 401);
const handleJwtTokenExpireError = () =>
  new AppError('the token you input is Expire', 401);
// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
//   console.log(value);
//   const message = `Duplicate field value: ${value}. Please use another value`;
//   return new AppError(message, 400);
// };

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error : send message to client
  if (true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error('Error', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fails';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    let error = { name: err.name, ...err };

    if (err instanceof CastError) error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtTokenExpireError();
    sendErrorProd(error, res);
  }
};

// --------------------------------------------------
// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };
// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     stack: err.stack,
//     err,
//   });
// };
// const sendErrorProd = (err, res) => {
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   } //everything that is not marked operational
//   else {
//     console.error('💥 Error! 💥', err);
//     res.status(err.statusCode).json({
//       //status code is always 500
//       status: err.status, //status is always "error"
//       message: "There was an error, it's a problem from the server side! :(",
//     });
//   }
// };
// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500; //500 because of mongoose or something else. (unknown)
//   err.status = err.status || 'error';
//   if (process.env.NODE_ENV == 'development') sendErrorDev(err, res);
//   else if (process.env.NODE_ENV == 'production') {
//     let error = Object.create(err);
//     if (err.name == 'CastError') error = handleCastErrorDB(err);
//     sendErrorProd(error, res);
//     //sendErrorProd(error, res);
//   }
// };
// -------------------------------------
// const AppError = require('../Utils/appError');

// const handleCastErrorDB = (err) => {
//   const message = `invaild ${err.path} : ${err.value}`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
//   console.log(value);
//   const message = `Duplicate field value: ${value}. Please use another value`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

// const sendErrorProd = (err, res) => {
//   // Operational, trusted error : send message to client
//   if (true) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//     // Programming or other unknown error: don't lead error details
//   } else {
//     // 1) Log error
//     console.error('Error', err);

//     // 2) Send generic message
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong',
//     });
//   }
// };

// module.exports = (err, req, res, next) => {
//   // console.log(err.stack); //This will output a detailed list of functions calls that led up to the error,

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'fails';

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//     // res.status(err.statusCode).json({
//     //   status: err.status,
//     //   error: err,
//     //   message: err.message,
//     //   stack: err.stack,
//     // });
//     //   } else {
//     //     let error = { ...err };
//     // //  if (err.__proto__.name === 'CastError') error = handleCastErrorDB(error);
//     //     sendErrorProd(error, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err };
//     if (err instanceof CastError) error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     // if (error.name === 'CastError') error = handleCastErrorDB(error);
//     sendErrorProd(error, res);
//   }
//   // let error = { ...err };
//   // if (error.name === 'CastError') error = handleCastErrorDB(error);
//   // // if (err.name === 'CastError') err = handleCastErrorDB(err)
//   // sendErrorProd(error, res);
//   // res.status(err.statusCode).json({
//   //   status: err.status,
//   //   message: err.message,
//   // });
// };
// // res.status(err.statusCode).json({
// //   status: err.status,
// //   message: err.message,
// // });
