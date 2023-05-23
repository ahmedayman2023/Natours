const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
// 1) Middleware
app.use(express.json());
// Morgan that logs the method, URL, status code, response time, and size of the response.
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.requsetTime = new Date().toISOString();
  console.log(req.headers);
  next();
});
app.use(express.static(`${__dirname}/public`));

// 3)Routs
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

// هحط ميدل وير بحيث لو انا كاتب غلط المسار يطلع رسالى خطا كويسه و لازم تتحط بعد الروت
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'falid',
  //   message: `there something wrong in url ${req.originalUrl}`,
  // });
  // ---------after watch ep 114 -------------------
  // const err = new Error(`there something wrong in url ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = 'fails';
  // ----------after watch ep 115 ---------------------
  next(new AppError(`there something wrong in url ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);
// EP 114
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'fails';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

// 4)Server

module.exports = app;

// (My Wrong Syntax)-------------------------------------------------------------------------------------------------

// app.all('*', (req, res, next) => {
//     // res.status(404).json({
//     //   status: 'falid',
//     //   message: `there something wrong in url ${req.originalUrl}`,
//     // });
//     const statusCode = 404;
//     const status = 'fails';
//     const message = `there something wrong in url ${req.originalUrl}`;
//     next(err);
// });

// app.use((err, req, res, next) => {
//     res.statusCode = res.statusCode || 500;
//     res.status = res.status || 'fails';
//     res.message = err.message;
// });
