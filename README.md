# mealit/Backend

This repository contains the backend code for a web application developed by Mealit.

The backend is responsible for handling server-side logic and API endpoints required for the application to function.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Project structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)

---

## Overview

The backend of our project is built using Node.js, Express.js, and MongoDB, following a RESTful API architecture. Here's an overview of the main technologies used :

1. **Node.js**: Node.js is a JavaScript runtime environment that allows you to run JavaScript code on the server-side. It provides an event-driven, non-blocking I/O model, which makes it well-suited for building scalable and efficient applications.

2. **Express.js**: Express.js is a web application framework for Node.js. It provides a set of features and utilities for building web applications and APIs. Express.js simplifies the process of defining routes, handling requests and responses, and implementing middleware.

3. **MongoDB**: MongoDB is a popular NoSQL database that provides a flexible and scalable way to store and retrieve data. It uses a document-based model, where data is stored in JSON-like documents. MongoDB is well-suited for handling unstructured or semi-structured data.

4. **Mongoose**: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a higher-level abstraction for interacting with MongoDB by defining schemas and models. Mongoose simplifies tasks like validating data, defining relationships between collections, and performing database operations.

---

## Setup

To set up the backend repository locally, follow these steps:

1. Start by cloning the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/mealit01/Backend.git
   ```

---

2. Navigate to the cloned repository directory:
   ```bash
   cd Backend
   ```
   This command will change your current directory to the cloned repository.

---

3. Install the required dependencies:
   ```
   npm install
   ```
   This command will read the package.json file and install all the necessary dependencies.

---

4. Configure the environment variables:

   - Create a .env file in the root directory of the project. You can use a text editor to create and edit the file.

   - Add the following variables to the .env file:

     ```makefile
     PORT=3000
     DATABASE = mongodb://localhost:27017/mealit
     JWT_SECRET=your_secret_key_here
     JWT_EXPIRES_IN = 90d
     JWT_COOKIE_EXPIRES_IN = 90

     // for reset pasword mails
     EMAIL_HOST =
     EMAIL_PORT =
     EMAIL_USERNAME =
     EMAIL_PASSWORD =

     ```

---

## Project structure

- **config**: This directory contains configuration files for the project, such as database configuration, environment variables, and other settings.

- **controllers**: The controllers directory holds the logic for handling requests and generating responses. Each controller typically corresponds to a specific endpoint or a group of related endpoints. It interacts with the models and services to process the data and send the appropriate response.

- **middlewares**: Middlewares are functions that intercept incoming requests or outgoing responses. They can perform various tasks, such as authentication, request validation, error handling, logging, etc. The middlewares directory contains these functions that can be applied to specific routes or globally to the entire application.

- **models**: Models represent the application's data structure and provide an interface for interacting with the database. They define the schema and methods for querying, inserting, updating, and deleting data. In your case, the models directory contains the Mongoose models that map to the MongoDB collections.

- **routes**: Routes define the endpoints and the corresponding handlers in the application. They specify the URL paths, HTTP methods, and the functions (controllers) to be executed when a request is made to a specific endpoint. The routes directory contains these route definitions.

- **utils**: The utils directory holds utility functions that are used throughout the project. These functions provide common functionality that can be reused across different parts of the application.

this architecture allows you to handle HTTP requests from the frontend, process them using controllers and middlewares, interact with the MongoDB database using Mongoose models, and send back the appropriate responses.

---

## API Endpoints

### **User Endpoints:**

- **`/api/user/signup`** Method: **`POST` :**
  This endpoint is used for user registration. It expects a POST request with user registration data and creates a new user account.
- **`/api/user/login`** Method: **`POST` :**
  This endpoint is used for user login. It expects a POST request with user credentials and validates them to authenticate the user.
- **`api/user/forgetPassword`** Method: **`POST` :**
  This endpoint is used when a user forgets their password. It expects a POST request with the user's email and sends a password reset email to the user.
- **`/api/user/resetPassword/`** Method: **`PATCH` :**
  This endpoint is used to reset the user's password. It expects a PATCH request with a password reset token and a new password, and updates the user's password accordingly.
- **`api/user/updatePassword/`** Method: **`PATCH` :**
  This endpoint is used to update the user's password. It expects a PATCH request with the user's current password and a new password.
- **`api/user/updateInfo`** Method: **`PATCH` :**
  This endpoint is used to update the user's account information. It expects a PATCH request with the user's updated information.
- **`api/user/delete`** Method: **`DELETE` :**
  This endpoint is used to delete the user's account. It expects a DELETE request and deletes the user's account along with any associated data.

---

### Recipes Endpoints:

- **`/api/recipes?page=2&limit=15`** Method: **`GET` :**
  This endpoint is used to retrieve a paginated list of recipes. It expects a GET request with optional query parameters for pagination and returns a list of recipes.
- **`/api/recipes/getRecipe/64a15c884ea87b2e946ac5de`** Method: **`GET` :**
  This endpoint is used to retrieve a specific recipe. It expects a GET request with the recipe ID and returns the corresponding recipe.
- **`/api/recipes/bookmark/64a15c884ea87b2e946ac5de`** Method: **`PATCH` :**
  This endpoint is used to bookmark a recipe. It expects a PATCH request with the recipe ID and adds the recipe to the user's bookmarked recipes.
- **`/api/user/GetAllBookmarkedRecipe`** Method: **`GET` :**
  This endpoint is used to retrieve all the recipes bookmarked by a user. It expects a GET request and returns a list of bookmarked recipes.
- **`/api/recipes/getHistory`** Method: **`GET` :**
  This endpoint is used to retrieve the user's recipe history. It expects a GET request and returns a list of previously viewed recipes.
- **`/api/recipes/search?page=1&limit=15`** Method: **`POST` :**

  This endpoint is used to search for recipes based on certain criteria. It expects a POST request with search parameters and returns a list of matching recipes.

- **`/api/recipes/delete/645caee551e6952b6de89662`** Method: **`DELETE`:**
  This endpoint is used to delete a recipe. It expects a DELETE request with the recipe ID and deletes the corresponding recipe.

---

### Planner Endpoints:

- **`/api/planner/getPlannerDays`** Method: **`GET` :**
  This endpoint is used to retrieve the planner days for a user. It expects a GET request and returns a list of planner days.
- **`/api/planner/getDay/27`** Method: **`GET` :**
  This endpoint is used to retrieve a specific planner day. It expects a GET request with the day ID and returns the corresponding planner day.
- **`/api/planner/add/breakfast/27/64a15c884ea87b2e946ac5de`** Method: **`PATCH` :**
  This endpoint is used to add a breakfast item to a planner day. It expects a PATCH request with the meal type, day ID, and recipe ID, and adds the breakfast item to the planner day.
- **`/api/planner/delete/breakfast/6/64a15c884ea87b2e946ac5de`** Method: **`DELETE` :**
  This endpoint is used to delete a breakfast item from a planner day. It expects a DELETE request with the meal type, item ID, and recipe ID, and removes the breakfast item from the planner day.
- **`/api/planner/add/lunch/27/64a15c884ea87b2e946ac5de`** Method: **`PATCH` :**
  This endpoint is used to add a lunch item to a planner day. It expects a PATCH request with the meal type, day ID, and recipe ID, and adds the lunch item to the planner day.
- **`/api/planner/delete/lunch/26/64a15c884ea87b2e946ac5de`** Method: **`DELETE` :**
  This endpoint is used to delete a lunch item from a planner day. It expects a DELETE request with the meal type, item ID, and recipe ID, and removes the lunch item from the planner day.
- **`/api/planner/add/dinner/26/64a15c884ea87b2e946ac5de`** Method: **`PATCH`:**
  This endpoint is used to add a dinner item to a planner day. It expects a PATCH request with the meal type, day ID, and recipe ID, and adds the dinner item to the planner day.
- **`/api/planner/delete/dinner/6/64a15c884ea87b2e946ac5de`** Method: **`DELETE` :**
  This endpoint is used to delete a dinner item from a planner day. It expects a DELETE request with the meal type, item ID, and recipe ID, and removes the dinner item from the planner day.

---

### Pantry Endpoints:

- **`/api/pantry`** Method: **`GET` :**
  This endpoint is used to retrieve the user's pantry items. It expects a GET request and returns a list of pantry items.
- **`/api/pantry/ingredient/649fd3e682c0b8498250d617`** Method: **`GET` :**
  This endpoint is used to retrieve a specific pantry item. It expects a GET request with the item ID and returns the corresponding pantry item.
- **`/api/pantry/add`** Method: **`POST`:**
  This endpoint is used to add a new pantry item. It expects a POST request with the item details and adds the item to the user's pantry.
- **`/api/pantry/delete/649fcd899e9ce83593668e8f`** Method: **`DELETE`:**
  This endpoint is used to delete a pantry item. It expects a DELETE request with the item ID and deletes the corresponding pantry item.
- **`/api/pantry/update/64a12cf4af7e7718fc441938`** Method: **`PATCH` :**
  This endpoint is used to update a pantry item. It expects a PATCH request with the item ID and updated details, and updates the corresponding pantry item.

---

### Shopping list Endpoints:

- **`/api/shopping`** Method: **`GET` :**
  This endpoint is used to retrieve the user's shopping list. It expects a GET request and returns a list of shopping list items.
- **`/api/shopping/ingredient/649fd3e682c0b8498250d617`** Method: **`GET` :**
  This endpoint is used to retrieve a specific shopping list item. It expects a GET request with the item ID and returns the corresponding shopping list item.
- **`/api/shopping/add`** Method: **`POST`:**
  This endpoint is used to add a new item to the shopping list. It expects a POST request with the item details and adds the item to the user's shopping list.
- **`/api/shopping/delete/649fcd899e9ce83593668e8f`** Method: **`DELETE` :**
  This endpoint is used to delete a shopping list item. It expects a DELETE request with the item ID and deletes the corresponding shopping list item.
- **`/api/shopping/update/64a12cf4af7e7718fc441938`** Method: **`PATCH` :**
  This endpoint is used to update a shopping list item. It expects a PATCH request with the item ID and updated details, and updates the corresponding shopping list item.

---

## Data Models

### User Model

The User model contains information about each user of the application:

```js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'Please tell us your first name!'],
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your last name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },

      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  bookmarkedRecipes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipes',
    },
  ],
  lastVisitedAt: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipes',
    },
  ],
  pantry: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Ingredients',
    },
  ],
  shopping: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Ingredients',
    },
  ],
  planner: [
    {
      day: Number,
      dayOfWeek: String,
      breakfast: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Recipes',
        },
      ],
      lunch: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Recipes',
        },
      ],
      dinner: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Recipes',
        },
      ],
    },
  ],
});
```

---

### Ingredient Model

The Ingredient model represents individual ingredients used in the application:

```js
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
  },
  category: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
```

---

### Recipe Model

The Recipe model contains information about each recipe that is available for selection in the application:

```js
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
      ref: 'User', // Define the recipes schema
    },
  ],
  imageUrl: String,
});
```

---
