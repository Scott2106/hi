const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const siteController = require("../controllers/siteController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const sessionController = require("../controllers/sessionController");
const taskController = require("../controllers/taskController");
const requestController = require("../controllers/requestController");

router.post(
  "/login",
  siteController.getSiteIdBySiteApiKey,
  userController.validateDomain,
  userController.getUserIdByEmail,
  userController.findUserPassword,
  bcryptMiddleware.comparePassword,
  jwtMiddleware.generateRefreshToken,
  sessionController.addNewSession,
  jwtMiddleware.generateEmailVerificationToken,
  requestController.checkRequest,
  taskController.recordVerificationTask
);

router.post(
  "/register",
  siteController.dummySiteIdRetrival,
 // siteController.getSiteIdBySiteApiKey,
  userController.validateDomain,
  userController.checkEmailDuplicate,
  bcryptMiddleware.hashPassword,
  userController.registerUser,
  jwtMiddleware.generateEmailVerificationToken,
  requestController.checkRequest,
  taskController.recordVerificationTask
);

router.post(
  "/verify",
  jwtMiddleware.verifyEmailVerificationToken,
  requestController.checkTokenAvailability,
  requestController.updateRequestStatus,
  userController.updateUserStatus,
  userController.updateUserVerificationStatus,
  jwtMiddleware.generateRefreshToken,
  sessionController.addNewSession
);

router.post(
  "/refresh_token",
  sessionController.checkRefreshToken,
  jwtMiddleware.generateLoginAccessToken
);

router.get(
  "/protected",
  jwtMiddleware.verifyToken,
  sessionController.checkRefreshToken,
  jwtMiddleware.checkRefreshTokenValidTime,
  sessionController.updateRefreshToken
);

// router.delete('/site_admin/:siteId/:userId', roleController.isAdmin, roleController.getTargetUserRole, userController.deleteUser);

module.exports = router;
