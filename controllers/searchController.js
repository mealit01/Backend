exports.getSearchFilters = async (req, res, next) => {
  const filters = [
    'preparation_time',
    'cooking_time',
    'total_time',
    'servings',
    'calories',
    'carbohydrates',
    'sugars',
    'fat',
    'cholesterol',
    'protein',
    'dietary_fiber',
    'sodium',
    'calories_from_fat',
    'calcium',
    'iron',
    'magnesium',
    'potassium',
    'vitamin_c',
    'diet_type',
    'allergens',
    'cuisine',
  ];

  res.status(200).json({
    status: 'success',
    length: filters.length,
    filters,
  });
};
