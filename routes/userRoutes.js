const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();
const authController = require('./../controllers/authController');

router.post(`/signup`, authController.signup);

router.post(`/login`, authController.login);
router.post(`/forgetPassword`, authController.forgetPass);
router.patch(`/resetPassword/:token`, authController.resetPass);
router.patch(
  `/updatePassword`,
  authController.protect,
  authController.updatePass
);
router.patch(`/updateInfo`, authController.protect, userController.update);
router.delete(`/delete`, authController.protect, userController.delete);
router.route(`/info`).get(authController.protect, userController.getName);

router.route(`/`).get(authController.protect, userController.getAllUsers);


module.exports = router;
