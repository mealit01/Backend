const axios = require('axios');

async function getRes(body) {
  try {
    console.log(body);
    const response = await axios.post(
      'http://18.222.143.73:5000/get-recipe',
      body
    );

    let dataAfterRespose = response.data;
    dataAfterRespose = JSON.parse(dataAfterRespose);
    let urls = Object.values(dataAfterRespose.url); 
    console.log(urls);
    
    return urls;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getRes;
