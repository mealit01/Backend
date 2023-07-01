const Ingredients = require('../models/ingredientModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.addIngredient = catchAsync(async (req, res) => {
  const nwIngredient = await Ingredients.create({
    name: req.body.name,
    quantity: req.body.quantity,
    expiryDate: req.body.expiryDate,
    category: req.body.category,
    from: 'Pantry_' + req.body.name,
  });

  req.user.pantry.addToSet(nwIngredient._id);
  await User.findByIdAndUpdate(req.user._id, req.user, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    nwIngredient,
  });
});

exports.getAllIngredients = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.findById(req.user.id).populate({
      path: 'pantry',
      select: '-from -__v',
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const user = await features.query;
  const ingredients = user[0].pantry;

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    length: ingredients.length,
    data: {
      ingredients,
    },
  });
});

exports.getIngredientById = catchAsync(async (req, res, next) => {
  const ingredient = await Ingredients.findById(req.params.id);

  if (!ingredient) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ingredient,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'quantity');

  const updatedIngredient = await Ingredients.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedIngredient) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedIngredient,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await Ingredients.findByIdAndDelete(req.params.id);
  req.user.pantry.pull(req.params.id);
  await User.findByIdAndUpdate(req.user._id, req.user, {
    new: true,
    runValidators: true,
  });

  res.status(404).json({
    status: 'success',
  });
});
