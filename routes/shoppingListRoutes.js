const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.get(`/`, authController.protect, shoppingListController.getAllIngredients);
router.get(`/ingredient/:id`, authController.protect, shoppingListController.getIngredientById);
router.post(`/add`, authController.protect, shoppingListController.addIngredient);
router.patch(`/update/:id`, authController.protect, shoppingListController.update);
router.delete(`/delete/:id`,authController.protect, shoppingListController.delete);

module.exports = router;
