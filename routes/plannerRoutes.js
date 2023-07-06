const express = require('express');
const plannerController = require('../controllers/plannerController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(
  `/getPlannerDays`,
  authController.protect,
  plannerController.getPlannerDays
);
router.get(`/getDay/:day`, authController.protect, plannerController.getDay);
router.patch(
  `/add/:meal/:day/:id`,
  authController.protect,
  plannerController.addMeal
);

router.delete(
  `/delete/:meal/:day/:id`,
  authController.protect,
  plannerController.deleteMeal
);

module.exports = router;
