const mongoose = require('mongoose');

// Define the recipes schema
const recipesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  url: {
    type: String,
  },
  category: {
    type: String,
  },
  author: {
    type: String,
  },
  summary: {
    type: String,
  },
  rating: {
    type: Number,
  },
  ingredients: {
    type: Array,
  },
  directions: {
    type: String,
  },
  preparation_time: {
    type: String,
  },
  cooking_time: {
    type: String,
  },
  total_time: {
    type: String,
  },
  servings: {
    type: Number,
  },
  calories: {
    type: Number,
  },
  carbohydrates: {
    type: Number,
  },
  sugars: {
    type: Number,
  },
  fat: {
    type: Number,
  },
  protein: {
    type: Number,
  },
  dietary_fiber: {
    type: Number,
  },
  potassium: {
    type: Number,
  },
  diet_type: {
    type: Array,
  },
  allergens: {
    type: String,
  },
  cuisine: {
    type: String,
  },
  bookmarked: {
    type: Boolean,
    default: false,
  },
  bookmarkedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

// Create the Recipes model
const Recipes = mongoose.model('Recipes', recipesSchema);
module.exports = Recipes;
