const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");
const superAdminController = require('../controllers/superAdminController.js');
const jwtMiddleware = require('../middlewares/jwtMiddleware.js');

router.get("/report", jwtMiddleware.verifyToken, superAdminController.checkSuperAdmin, authController.getReport);

module.exports = router;  