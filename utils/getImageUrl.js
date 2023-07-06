const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch the image URL from a given URL
async function getImageUrl(url) {
  let imageUrl = null; // Initialize the imageUrl variable outside the try-catch block

  try {
    const response = await axios.get(url); // Send a GET request to the specified URL
    const html = response.data; // Get the HTML content from the response
    const $ = cheerio.load(html); // Load the HTML content into Cheerio for easy DOM manipulation
    imageUrl = $('meta[property="og:image"]').attr('content'); // Extract the image URL using a Cheerio selector
  } catch (error) {
    console.error('Error:', error); // Log any errors that occur during the request
    throw new Error(`Failed to fetch image URL: ${error.message}`); // Throw a new error with a descriptive message
  }

  return imageUrl; // Return the fetched image URL
}

module.exports = getImageUrl;
