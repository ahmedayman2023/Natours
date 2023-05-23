const catchAsync = require('./../Utils/catchAsync');
const User = require('../model/usermodel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'sucess',
    data: {
      users,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fails',
    message: 'there is something wrong',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fails',
    message: 'there is something wrong',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fails',
    message: 'there is something wrong',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fails',
    message: 'there is something wrong',
  });
};
