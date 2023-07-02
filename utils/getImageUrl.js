const axios = require('axios');
const cheerio = require('cheerio');

async function getImageUrl(url) {
  let imageUrl = null; // Initialize the imageUrl variable outside the try-catch block

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    imageUrl = $('meta[property="og:image"]').attr('content');
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch image URL: ${error.message}`);
  }

  return imageUrl;
}

module.exports = getImageUrl;
