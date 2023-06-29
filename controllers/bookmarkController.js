const Recipes = require('../models/recipesModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const addRecipeToUserBookmarks = catchAsync(async (userID, recipeID) => {
  const user = await User.findById(userID, { runValidators: true });
  user.bookmarkedRecipes = user.bookmarkedRecipes || [];

  await User.findByIdAndUpdate(
    userID,
    { $addToSet: { bookmarkedRecipes: recipeID } },
    {
      new: true,
      runValidators: true,
    }
  );
});

const addUserToRecipeBookmarks = catchAsync(async (userID, recipeID) => {
  const recipe = await Recipes.findById(recipeID);
  recipe.bookmarkedBy.push(userID);
  await Recipes.findByIdAndUpdate(recipeID, recipe);
});

const removeRecipeFromUserBookmarks = catchAsync(async (userID, recipeID) => {
  await User.findByIdAndUpdate(
    userID,
    { $pull: { bookmarkedRecipes: recipeID } },
    { new: true, runValidators: true }
  );
});

const removeUserFromRecipeBookmarks = catchAsync(async (userID, recipeID) => {
  await Recipes.findByIdAndUpdate(recipeID, {
    $pull: { bookmarkedBy: userID },
  });
});

exports.bookmark = catchAsync(async (req, res, next) => {
  const recipe = await Recipes.findById(req.params.id);

  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  recipe.bookmarkedBy ??= [];
  const { id: userID } = req.user;

  if (!recipe.bookmarkedBy.includes(userID)) {
    await addUserToRecipeBookmarks(userID, recipe.id);
    await addRecipeToUserBookmarks(userID, recipe.id);
  } else {
    await removeUserFromRecipeBookmarks(userID, recipe.id);
    await removeRecipeFromUserBookmarks(userID, recipe.id);
  }

  res.status(200).json({
    status: 'success',
    mark: !recipe.bookmarkedBy.includes(userID) ? 'marked' : 'unmarked',
  });
});
