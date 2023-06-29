const express = require('express');
const authController = require('./../controllers/authController');
const recipesController = require('../controllers/recipesController');

const router = express.Router();

router
  .route(`/`)
  .get(authController.checkIfUserLoggedIn, recipesController.getAllRecipes);

router
  .route(`/getRecipe/:id`)
  .get(authController.checkIfUserLoggedIn, recipesController.getRecipeById);
router.patch(`/updateRecipe/:id`, recipesController.update);

router.delete(`/delete/:id`, recipesController.delete);
router.post(`/add`, recipesController.addRecipes);

module.exports = router;
