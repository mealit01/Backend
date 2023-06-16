const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Mealit = require('./Mealit');


const DB =  process.env.DATABASE_PASSWORD;


mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection sucsessful!'));


// Set the port 
const port = process.env.PORT;

// Start the Express server
Mealit.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});