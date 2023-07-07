const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDays = (user, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setDate(start.getDate() - 10);
  end.setDate(end.getDate() + 10);

  const days = [];
  while (start <= end) {
    const day = start.getDate();
    const dayOfWeek = daysOfWeek[start.getDay()];

    let plannerElement =
      user.planner.find(
        (el) => el.day === day * 1 && el.dayOfWeek === dayOfWeek
      ) || {};

    const { breakfast = [], lunch = [], dinner = [] } = plannerElement;

    days.push({ day, dayOfWeek, breakfast, lunch, dinner });
    start.setDate(start.getDate() + 1);
  }

  return days;
};

exports.getPlannerDays = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const days = getDays(req.user, new Date(), new Date());

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { planner: days },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    days: updatedUser.planner,
  });
});

exports.getDay = catchAsync(async (req, res) => {
  let day = req.user.planner.find((el) => el.day === req.params.day * 1);

  if (!day) {
    return res.status(404).json({
      status: 'fail',
      message: 'Day not found',
    });
  }

  day = await User.findOne({ _id: req.user._id })
    .populate('planner.breakfast planner.lunch planner.dinner')
    .exec();

  res.status(200).json({
    status: 'success',
    day: day.planner.find((el) => el.day === req.params.day * 1),
  });
});

exports.addMeal = catchAsync(async (req, res, next) => {
  const { meal, day, id } = req.params;

  const planner = req.user.planner.find((el) => el.day === Number(day));

  if (!planner) {
    return next(new AppError('Day not found', 404));
  }

  planner[meal].addToSet(id);

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.user, {
    new: true,
    runValidators: true,
  });

  const updatedPlanner = updatedUser.planner.find(
    (el) => el.day === Number(day)
  );

  res.status(200).json({
    status: 'success',
    day: updatedPlanner,
  });
});

exports.deleteMeal = catchAsync(async (req, res) => {
  const { meal, day, id } = req.params;

  const planner = req.user.planner.find((el) => el.day === Number(day));

  if (!planner) {
    return next(new AppError('Day not found', 404));
  }

  planner[meal].pull(id);

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.user, {
    new: true,
    runValidators: true,
  });

  const updatedPlanner = updatedUser.planner.find(
    (el) => el.day === Number(day)
  );

  res.status(200).json({
    status: 'success',
    day: updatedPlanner,
  });
});
