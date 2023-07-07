const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const MealitApp = require('./MealitApp');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection sucsessful!'));
/*
const options = {
  key: fs.readFileSync('SSL/key.pem'), // Read the private key file
  cert: fs.readFileSync('SSL/cert.pem'), // Read the certificate file
};*/

// Set the port
const port = 4000 || process.env.PORT;
/*
// Start the Express server
https.createServer(options, MealitApp).listen(port, () => {
  console.log(`App running on port: ${port} with SSL enabled.`);
});
*/

MealitApp.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});
