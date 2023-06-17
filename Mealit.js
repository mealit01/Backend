// ------- Import required modules -------- \\

const express = require('express');                
const rateLimit = require('express-rate-limit');        // Rate limiter for limiting repeated requests
const helmet = require('helmet');                       // Security middleware to set HTTP headers
const mongoSanitize = require('express-mongo-sanitize'); // Middleware to protect against MongoDB query injection attacks
const xss = require('xss-clean');                        // Middleware to sanitize user input from malicious XSS attacks

const morgan = require('morgan');                       // HTTP request logger middleware
const AppError = require('./utils/appError');            // Custom error handling utility
const globalErrorHandler = require('./controllers/errorController'); // Global error handling middleware
const userRouter = require('./routes/userRoutes.js');       // User route handler
//const recipeRouter = require('./routes/recipeRoutes');   // Recipe route handler
const cors = require("cors");
const Mealit = express();                               // Create an Express application instance

Mealit.use(cors());

Mealit.use(express.json());                             // Middleware to parse incoming requests with JSON payloads

// Set security HTTP headers using the helmet middleware
Mealit.use(helmet());

// Middleware to parse incoming requests with JSON payloads and limit request body size to 10kb
Mealit.use(express.json({ limit: '10kb' }));

// Middleware to sanitize user input and prevent MongoDB query injection attacks
Mealit.use(mongoSanitize());

// Middleware to sanitize user input and prevent malicious XSS attacks
Mealit.use(xss());

// Middleware to log HTTP requests, only used in development environment
if (process.env.NODE_ENV === 'development') {
  Mealit.use(morgan('dev'));
}

// Rate limiter to limit repeated requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

// Use the rate limiter middleware for all routes starting with '/api'
Mealit.use(`/api`, limiter);

// Middleware to serve static files from the 'public' folder
Mealit.use(express.static(`${__dirname}/public`));

// Middleware to set the requestTime property on the request object to the current time
Mealit.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handler for user routes
Mealit.use(`/api/user`, userRouter);

// Route handler for recipe routes
//Mealit.use(`/api/recipes`, recipeRouter);

// Middleware to handle 404 errors for all other routes
Mealit.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
Mealit.use(globalErrorHandler);
module.exports = Mealit;
