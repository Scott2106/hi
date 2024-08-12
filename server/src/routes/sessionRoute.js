const express = require('express');
const router = express.Router();

const sessionController = require("../controllers/sessionController");
const superAdminController = require('../controllers/superAdminController.js');
const jwtMiddleware = require('../middlewares/jwtMiddleware.js');

router.get("/report", jwtMiddleware.verifyToken, superAdminController.checkSuperAdmin, sessionController.getReport);

module.exports = router;