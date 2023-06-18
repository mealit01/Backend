const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: true });

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    length: users.length,
    data: {
      users,
    },
  });
});

exports.getInfo = catchAsync(async (req, res, next) => {
  const firstName = req.user.firstName, lastName = req.user.lastName, email = req.user.email;
  res.status(200).json({
    status: 'success',
    data: {
      firstName,
      lastName,
      email
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    );

  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'username'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(404).json({
    status: 'success',
    data: '',
  });
});
