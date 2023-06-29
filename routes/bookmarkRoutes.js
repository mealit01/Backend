const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.patch(
  `/bookmark/:id`,
  authController.protect,
  bookmarkController.bookmark
);

module.exports = router;
