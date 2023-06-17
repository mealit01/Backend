const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mealit = require('./Mealit');

dotenv.config({ path: './config.env' });

const cors = require("cors");
const DB =  process.env.DATABASE;

Mealit.use(cors())

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection sucsessful!'));


// Set the port 
const port = 4000 || process.env.PORT;

// Start the Express server
Mealit.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});