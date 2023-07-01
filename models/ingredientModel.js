const mongoose = require('mongoose');

// Define the ingredients schema
const ingredientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uqique: true,
  },
  quantity: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
  ingredientAddedAt: Date,
  from: {
    type: String,
    uqique: true,
  },
  category: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

ingredientsSchema.pre('save', function (next) {
  this.ingredientAddedAt = Date.now() - 1000;
  next();
});

// Create the Ingredients model
const Ingredients = mongoose.model('Ingredients', ingredientsSchema);
module.exports = Ingredients;
