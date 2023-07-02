const express = require('express');
const searchController = require('../controllers/searchController');
const router = express.Router();

router.get(`/filters`, searchController.getSearchFilters);

//router.post(`/findRecipe`, searchController.searchEngine);
module.exports = router;
