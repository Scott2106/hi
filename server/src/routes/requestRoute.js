const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");
const taskController = require("../controllers/taskController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const userController = require("../controllers/userController");
const siteController = require("../controllers/siteController");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const OAuthController = require("../controllers/OAuthController");

// --------------------------------------------//
// site_id to be retrieved from auth headers   //
// --------------------------------------------//
router.post(
  "/forgot_password",
  siteController.dummySiteIdRetrival,
  userController.validateDomain,
  userController.getUserIdByEmail,
  OAuthController.checkOAuthID,
  jwtMiddleware.generateResetPasswordToken,
  requestController.checkRequest,
  taskController.recordForgotPasswordTask,
);

router.put("/reset_password", 
  siteController.dummySiteIdRetrival,
  jwtMiddleware.verifyResetPasswordToken,
  requestController.checkTokenAvailability,
  bcryptMiddleware.hashPassword,
  requestController.updateRequestStatus,
  userController.updateUserPassword,
);

router.post(
  "/resend_email",
  siteController.dummySiteIdRetrival,
  userController.getUserIdByEmail,
  OAuthController.checkOAuthID,
  jwtMiddleware.generateEmailVerificationToken,
  requestController.checkRequest,
  taskController.recordVerificationTask,
);

module.exports = router;
