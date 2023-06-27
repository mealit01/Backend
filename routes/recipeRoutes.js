const express = require('express');
const recipesController = require('../controllers/recipesController');
const router = express.Router();

//router.route(`/`).get(recipesController.getAllRecipes);

router.route(`/getRecipe/:id`).get(recipesController.getRecipeById);
router.patch(`/updateRecipe/:id`, recipesController.update);
router.delete(`/delete/:id`, recipesController.delete);
router.post(`/add`, recipesController.addRecipes);

module.exports = router;
