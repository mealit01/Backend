const Recipes = require('../models/recipesModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.bookmark = catchAsync(async (req, res, next) => {
  const recipe = await Recipes.findById(req.params.id);

  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  const findRecipe = req.user.bookmarkedRecipes.findIndex((el) => {
    return el.equals(recipe._id);
  });

  const findUser = recipe.bookmarkedBy.findIndex((el) => {
    return el.equals(req.user._id);
  });

  if (findRecipe !== -1 || findUser !== -1) {
    req.user.bookmarkedRecipes.pull(recipe._id);
    recipe.bookmarkedBy.pull(req.user._id);
    recipe.bookmarked = false;
  } else {
    req.user.bookmarkedRecipes.addToSet(recipe._id);
    recipe.bookmarkedBy.addToSet(req.user._id);
    recipe.bookmarked = true;
  }

  await Promise.all([
    User.findByIdAndUpdate(req.user._id, req.user, {
      new: true,
      runValidators: true,
    }),
    recipe.save(),
  ]);

  res.status(200).json({
    status: 'success',
    recipe,
  });
});
