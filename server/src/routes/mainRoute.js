const express = require("express");
const router = express.Router();
const OAuthRoute = require("./OAuthRoute");
const siteRoute = require("./siteRoute");
const roleRoute = require("./roleRoute");
const userRoute = require("./userRoute");
const sessionRoute = require("./sessionRoute");
const authRoute = require("./authRoute");
const superAdminRoute = require("./superAdminRoute");
const requestRoute = require("./requestRoute");

const sessionController = require("../controllers/sessionController");

// Oauth Routes
router.use("/OAuth", OAuthRoute);

// Site Routes
router.use("/site", siteRoute);

// Session Routes
router.use("/session", sessionRoute);

// Auth Routes
router.use("/auth", authRoute);

// Role Routes
router.use("/role", roleRoute);

// User Routes
router.use("/user", userRoute);

// Super Admin Routes
router.use("/superAdmin", superAdminRoute);

// Request Routes
router.use("/request", requestRoute);

router.put("/logout/:userId/:siteId", sessionController.updateLogoutTimestamp);

module.exports = router;
