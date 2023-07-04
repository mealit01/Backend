const Recipes = require('../models/recipesModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const getRes = require('../utils/getRes');
const getImageUrl = require('../utils/getImageUrl');
const fs = require('fs');

exports.getSearchFilters = catchAsync(async (req, res, next) => {
  const filters = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/filter.json`)
  );

  res.status(200).json({
    status: 'success',
    length: filters.length,
    filters,
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const responseData = await getRes(req.body);

  let data = [];
  await Promise.all(
    responseData.map(async (url) => {
      const recipe = await Recipes.findOne({ url });
      const imageUrl = await getImageUrl(recipe.url);
      recipe.imageUrl = imageUrl;
      await recipe.save();

      data.push(recipe);
    })
  );

  res.status(200).json({
    status: 'success',
    length: data.length,
    data,
  });
});
