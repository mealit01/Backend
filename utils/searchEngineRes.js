const axios = require('axios');

// Function to get recipes using a POST request
async function getRes(body) {
  try {
    // Make a POST request to the specified URL with the provided body
    const response = await axios.post(
      'http://18.222.143.73:5000/get-recipe',
      body
    );

    let dataAfterRespose = response.data;
    // Parse the response data from JSON to an object
    dataAfterRespose = JSON.parse(dataAfterRespose);
    // Extract the URL values from the response object
    let urls = Object.values(dataAfterRespose.url);
    // Log the URLs to the console
    console.log(urls);

    return urls; // Return the URLs
  } catch (error) {
    console.error('No recipes found'); // Log an error message if no recipes are found
  }
}

module.exports = getRes;
