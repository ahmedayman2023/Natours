const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

// ---------------- to make code so short ------------------

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// --------------------------------------------------------------

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      User: newUser,
    },
  });
});
// -------------------------------EP 130----------------------------
exports.login = catchAsync(async (req, res, next) => {
  // Input email & password
  const { email, password } = req.body;

  // check of the input is email & password
  if (!email || !password) {
    return next(new AppError('please invoid email,password', 400));
  }

  // Check if the user and password correct
  const user = await User.findOne({ email }).select('+password');

  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything OK , SEND TOKEN TO CLIENT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});
// ---------------------------------------------------------------------

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //STEP1 === Getting token and check if it exist ----------------- the problem in postman i should choose the Header -----------------
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    // req.header.authorization &&
    // req.header.authorization.startsWith('Bearer')
    //req.header.authorization.startsWith === 'Bearer' that's my wrong syntax
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  // 401 = unauthorized
  if (!token) {
    return next(
      new AppError('You are not loggedIN please log in to get access', 401)
    );
  }
  //STEP 2 === Verification token  1) I spelled promisify uncorrect
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //STEP3 === Check If user is it exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('the user not exist', 401));
  }
  console.log(currentUser);
  /*STEP4 === if the user changePassword
                                check if user changed password after the token was issued
                                */
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('USER recently change password please, log in again', 401)
    );
  }
  // GRANT ACCESS to PROTECTED ROUTER
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...role) =>
  (req, res, next) => {
    // roles ['admin','lead-guide'], role="user"    --->403 forbidden
    // Don't forge 1) includes 2)before this middleware put req.body=currentUser
    if (!role.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action ', 403)
      );
    }
    next();
  };
