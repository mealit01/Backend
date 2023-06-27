const Recipes = require('../models/recipesModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');

const recipesToAdd = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/recipes.json`)
);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.addRecipes = catchAsync(async (req, res) => {
  recipesToAdd.forEach((obj) => {
    Recipes.create({
      name: obj.name,
    });
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.getAllRecipes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Recipes.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const recipe = await features.query;

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    length: recipe.length,
    data: {
      recipe,
    },
  });
});

exports.getRecipeById = catchAsync(async (req, res, next) => {
  const recipe = await Recipes.findById(req.params.id);

  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      recipe,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name');

  // 3) Update user document
  const updatedRecipe = await Recipes.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRecipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedRecipe,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await Recipes.findByIdAndDelete(req.params.id);

  res.status(404).json({
    status: 'success',
    data: '',
  });
});
