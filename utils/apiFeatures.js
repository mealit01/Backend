class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filter the query based on the provided query string parameters
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // Remove excluded fields from the query object
    excludedFields.forEach((el) => delete queryObj[el]);

    // Convert the query object to a string and replace comparison operators with MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Update the query with the filtered criteria
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sort the query based on the provided sort parameter
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sorting by createdAt field in descending order
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // Limit the fields to be included in the query result
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude the '__v' field by default
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // Paginate the query results based on the provided page and limit parameters
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // Apply pagination to the query
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
