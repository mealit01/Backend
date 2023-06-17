require('dotenv').config();
const mongoose = require('mongoose');
const Mealit = require('./Mealit');
const cors = require("cors");
const DB =  process.env.DATABASE;

Mealit.use(cors());

Mealit.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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