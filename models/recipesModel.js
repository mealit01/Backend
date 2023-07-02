const mongoose = require('mongoose');

// Define the recipes schema
const recipesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  url: String,
  category: String,
  author: String,
  summary: String,
  rating: Number,
  review_count: Number,
  ingredients: Array,
  directions: Array,
  preparation_time: String,
  cooking_time: String,
  total_time: String,
  servings: Number,
  calories: Number,
  carbohydrates: Number,
  sugars: Number,
  fat: Number,
  cholesterol: Number,
  protein: Number,
  dietary_fiber: Number,
  sodium: Number,
  calories_from_fat: Number,
  calcium: Number,
  iron: Number,
  magnesium: Number,
  potassium: Number,
  vitamin_c: Number,
  diet_type: Array,
  allergens: String,
  cuisine: String,
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
  imageUrl: String,
});

// Create the Recipes model
const Recipes = mongoose.model('Recipes', recipesSchema);
module.exports = Recipes;
