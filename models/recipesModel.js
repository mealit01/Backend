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
    type: Array
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
  potassium:{
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
});

// Create the Recipes model
const Recipes = mongoose.model('Recipes', recipesSchema);
/*
const recipe = new Recipes({
    "name": "Simple Macaroni and Cheese",
    "url": "https://www.allrecipes.com/recipe/238691/simple-macaroni-and-cheese/",
    "category": "main-dish",
    "author": "g0dluvsugly",
    "summary": "A very quick and easy fix to a tasty side-dish. Fancy, designer mac and cheese often costs forty or fifty dollars to prepare when you have so many exotic and expensive cheeses, but they aren't always the best tasting. This recipe is cheap and tasty.",
    "rating": "4.42",
    "rating_count": "834",
    "review_count": "575",
    "ingredients": [
        "1 (8 ounce) box elbow macaroni ",
        " \u00bc cup butter ",
        " \u00bc cup all-purpose flour ",
        " \u00bd teaspoon salt ",
        "   ground black pepper to taste ",
        " 2 cups milk ",
        " 2 cups shredded Cheddar cheese"
    ],
    "directions": "Bring a large pot of lightly salted water to a boil. Cook elbow macaroni in the boiling water, stirring occasionally until cooked through but firm to the bite, 8 minutes. Drain. Melt butter in a saucepan over medium heat; stir in flour, salt, and pepper until smooth, about 5 minutes. Slowly pour milk into butter-flour mixture while continuously stirring until mixture is smooth and bubbling, about 5 minutes. Add Cheddar cheese to milk mixture and stir until cheese is melted, 2 to 4 minutes. Fold macaroni into cheese sauce until coated.",
    "prep": "10 mins",
    "cook": "20 mins",
    "total": "30 mins",
    "servings": "4",
    "yield": "4 servings",
    "calories": "630.2",
    "carbohydrates_g": "55.0",
    "sugars_g": "7.6",
    "fat_g": "33.6",
    "saturated_fat_g": "20.9",
    "cholesterol_mg": "99.6",
    "protein_g": "26.5",
    "dietary_fiber_g": "2.1",
    "sodium_mg": "777.0",
    "calories_from_fat": "302.2",
    "calcium_mg": "567.9",
    "iron_mg": "2.7",
    "magnesium_mg": "61.8",
    "potassium_mg": "380.0",
    "vitamin_a_iu_IU": "1152.0",
    "niacin_equivalents_mg": "10.1",
    "vitamin_c_mg": "0.3",
    "folate_mcg": "165.6",
    "thiamin_mg": "0.7",
    "diet_type": "vegetarian, omnivore, keto",
    "allergens": "milk",
    "cuisine": "chinese"
});

recipe.save();*/

module.exports = Recipes;
