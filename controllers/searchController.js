const Recipes = require('../models/recipesModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const searchEngineRes = require('../utils/searchEngineRes');
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
  const responseData = await searchEngineRes(req.body);
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

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const paginatedData = data.slice(skip, skip + limit);

  res.status(200).json({
    status: 'success',
    length: paginatedData.length,
    data: paginatedData,
  });
});
