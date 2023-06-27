class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filter method to handle basic and advanced filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // Remove excluded fields from the query object
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering: Convert query object to string and replace operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Parse the modified query string and update the query object
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sort method to handle sorting
  sort() {
    if (this.queryString.sort) {
      // If a sort query parameter is provided, update the query to sort accordingly
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // If no sort parameter is provided, sort by default field '-createdAt'
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // LimitFields method to handle selecting specific fields
  limitFields() {
    if (this.queryString.fields) {
      // If fields parameter is provided, select only those fields
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // If no fields parameter is provided, exclude '__v' field
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // Paginate method to handle pagination
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
