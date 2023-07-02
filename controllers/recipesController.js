const Recipes = require('../models/recipesModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const getImageUrl = require('../utils/getImageUrl');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.addRecipes = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.getAllRecipes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Recipes.find().select('-bookmarkedBy'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let recipes = await features.query;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    if (!req.user) {
      recipe.bookmarked = false;
    } else {
      recipe.bookmarked = req.user.bookmarkedRecipes.includes(recipe._id);
    }

    console.log(recipe.url);
    if (!recipe.imageUrl) {
      const imageUrlPromise = getImageUrl(recipe.url);
      recipe.imageUrl = await imageUrlPromise;
      await recipe.save();
    }

    if (
      !('sort' in req.query && req.query.sort === '-lastVisitedAt') ||
      ('sort' in req.query &&
        req.query.sort === '-lastVisitedAt' &&
        recipe.lastVisitedAt)
    ) {
      recipes[i] = recipe;
    }
  }

  res.status(200).json({
    status: 'success',
    length: recipes.length,
    recipes,
  });
});

exports.getRecipeById = catchAsync(async (req, res, next) => {
  const recipe = await Recipes.findById(req.params.id).select('-bookmarkedBy');

  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  if (!req.user) {
    recipe.bookmarked = false;
  } else {
    recipe.bookmarked = req.user.bookmarkedRecipes.includes(recipe._id);

    while (req.user.lastVisitedAt.length >= 6) {
      req.user.lastVisitedAt.shift();
    }

    //  req.user.lastVisitedAt.addToSet(recipe._id);
    await User.findByIdAndUpdate(req.user._id, req.user, {
      new: true,
      runValidators: true,
    });
  }

  if (!recipe.imageUrl) {
    const imageUrl = await getImageUrl(recipe.url);
    recipe.imageUrl = imageUrl;
    await recipe.save();
  }

  res.status(200).json({
    status: 'success',
    recipe,
  });
});

exports.getHistory = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'lastVisitedAt',
    select: '-bookmarkedBy -__v',
  });

  const History = user.lastVisitedAt;
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    length: History.length,
    History,
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
