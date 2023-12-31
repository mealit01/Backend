const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, status, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  const userObj = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  console.log(userObj.firstName);

  res.status(status).json({
    status: 'success',
    token,
    userInfo: userObj,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const existed = await User.findOne({ email }).select('+active');

  if (existed && existed.active === false) {
    await User.deleteOne({ email });
  }

  const nwUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.email.split('@')[0],
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(nwUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(`Please provide your email and password!`, 400));

  const user = await User.findOne({ email }).select(
    '+password active firstName lastName email'
  );

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('incorrect email and password!', 401));

  await User.updateOne({ email }, { $set: { active: true } });
  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    message: 'Logged out successfully',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check if it is exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('Please login to get access!', 401));

  // verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user is still exist
  const currUser = await User.findById(decoded.id);
  if (!currUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );

  // Check if user changed password after the token was issued
  if (currUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currUser;
  next();
});

exports.checkIfUserLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next();

  // verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user is still exist
  const currUser = await User.findById(decoded.id);

  // Check if user changed password after the token was issued
  if (!currUser || currUser.changedPasswordAfter(decoded.iat)) {
    return next();
  }

  req.user = currUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('This user is not allowed to perform this task', 403)
      );

    next();
  };
};

exports.forgetPass = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(res.STATUS_CODE.NoContent).send();
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  res.cookie('resetToken', resetToken, {
    expires: new Date(Date.now() + 10 * 60 * 1000),
    httpOnly: true,
  });

  await user.save({ validateBeforeSave: false });
  console.log(user);
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/user/resetPassword/${resetToken}`;
  const message = `Hello, ${user.firstName}!\nYour Mealit password can be reset by clicking the button below. if you did not request a new password, please ignore this email. your reset url ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Mealit - Reset your password',
      message,
    });

    res.status(200).json({
      status: 'success',
      resetToken,
      message: 'Token sent to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPass = catchAsync(async (req, res, next) => {
  console.log(req.params.token);
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log(Date.now());

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save();

  createSendToken(user, 201, res);
});

exports.updatePass = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(new AppError('incorrect password', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
