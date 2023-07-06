// ------- Import required modules -------- \\

const express = require('express');
const rateLimit = require('express-rate-limit'); // Rate limiter for limiting repeated requests
const helmet = require('helmet'); // Security middleware to set HTTP headers
const mongoSanitize = require('express-mongo-sanitize'); // Middleware to protect against MongoDB query injection attacks
const xss = require('xss-clean'); // Middleware to sanitize user input from malicious XSS attacks

const morgan = require('morgan'); // HTTP request logger middleware
const AppError = require('./utils/appError'); // Custom error handling utility
const globalErrorHandler = require('./controllers/errorController'); // Global error handling middleware
const userRouter = require('./routes/userRoutes.js'); // User route handler
const recipeRouter = require('./routes/recipeRoutes'); // Recipe route handler
const pantryRouter = require('./routes/pantryRoutes'); // pantry route handler
const shoppingListRouter = require('./routes/shoppingListRoutes'); // shoppingList route handler
const plannerRouter = require('./routes/plannerRoutes'); // planner route handler
const searchRouter = require('./routes/searchRoutes'); // shoppingList route handler
const bookmarkRouter = require('./routes/bookmarkRoutes'); // bookmark route handler

const cors = require('cors');
const MealitApp = express(); // Create an Express application instance

MealitApp.use(cors());

MealitApp.use(express.json()); // Middleware to parse incoming requests with JSON payloads

// Set security HTTP headers using the helmet middleware
MealitApp.use(helmet());

// Middleware to parse incoming requests with JSON payloads and limit request body size to 10kb
MealitApp.use(express.json({ limit: '10kb' }));

// Middleware to sanitize user input and prevent MongoDB query injection attacks
MealitApp.use(mongoSanitize());

// Middleware to sanitize user input and prevent malicious XSS attacks
MealitApp.use(xss());

// Middleware to log HTTP requests, only used in development environment
if (process.env.NODE_ENV === 'development') {
  MealitApp.use(morgan('dev'));
}

// Rate limiter to limit repeated requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Use the rate limiter middleware for all routes starting with '/api'
MealitApp.use(`/api`, limiter);

// Middleware to serve static files from the 'public' folder
MealitApp.use(express.static(`${__dirname}/public`));

// Middleware to set the requestTime property on the request object to the current time
MealitApp.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handler for user routes
MealitApp.use(`/api/user`, userRouter);

// Route handler for recipe routes
MealitApp.use(`/api/recipes`, recipeRouter, bookmarkRouter);

// Route handler for pantry routes
MealitApp.use(`/api/pantry`, pantryRouter);

// Route handler for shopping routes
MealitApp.use(`/api/shopping`, shoppingListRouter);

// Route handler for planner routes
MealitApp.use(`/api/planner`, plannerRouter);

MealitApp.use(`/api/recipes/search`, searchRouter);

// Middleware to handle 404 errors for all other routes
MealitApp.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
MealitApp.use(globalErrorHandler);
module.exports = MealitApp;
