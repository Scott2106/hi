const express = require('express');
const router = express.Router();

const siteController = require("../controllers/siteController");
const roleController = require("../controllers/roleController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// GET /api/sites/admin/{user_id}
router.get("/site_admin", jwtMiddleware.verifyToken, roleController.isAuthIncUser, siteController.getAdminSites); 

// POST /api/sites
// router.post("/site_admin", jwtMiddleware.verifyToken, roleController.isAuthIncUser, siteController.crateSite); 

module.exports = router;

