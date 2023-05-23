// AppError that extends the built-in Error class in Node.js.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // If the statusCode value starts with the number 4 (e.g., 400), this.status will be set to 'fails'. This is because status codes starting with 4 indicate client errors (e.g., a bad request from the client).On the other hand, if the statusCode value does not start with 4 (e.g., 500), this.status will be set to 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fails' : 'error';
    // علشان افرق بين مشكلة برمجة و مشكلة المستخدم عملها
    this.Operational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;

// (My Wrong Syntax)----------------------------------------------------------------------------------------------------------
// class appError extends err {
//   constructor(statusCode, message) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }
