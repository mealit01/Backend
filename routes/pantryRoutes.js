const express = require('express');
const pantryController = require('../controllers/pantryController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(`/`, authController.protect, pantryController.getAllIngredients);
router.get(`/ingredient/:id`, authController.protect, pantryController.getIngredientById);
router.post(`/add`,authController.protect, pantryController.addIngredient);
router.patch(`/update/:id`, authController.protect, pantryController.update);
router.delete(`/delete/:id`,authController.protect, pantryController.delete);

module.exports = router;
