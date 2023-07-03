const fs = require('fs');

exports.getSearchFilters = async (req, res, next) => {
  const filters = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/filter.json`)
  );

  res.status(200).json({
    status: 'success',
    length: filters.length,
    filters,
  });
};
