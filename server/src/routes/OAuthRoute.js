const express = require("express");
const router = express.Router();
const OAuthController = require("../controllers/OAuthController");
const userController = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const sessionController = require("../controllers/sessionController");
const siteController = require("../controllers/siteController");
const roleController = require("../controllers/roleController");

/* 
=======================================================================================
 Endpoints related to OAuth Authorisation: 
 - Get OAuth Client id and secrets
 - Redirect User to consent screen
=======================================================================================
*/

// Get OAuth Credentials
router.get(
  "/authorize/:provider_name",
  siteController.getSiteIdBySiteApiKey,
  OAuthController.getOAuthCredentials,
  OAuthController.generateAuthURL
);

/* 
=======================================================================================
 Endpoints related to OAuth Authorisation: 
 - Check user exists in the database with OAuth
 - Redirect User to email confirmation page
=======================================================================================
*/

// Get user data OAuth
router.get(
  "/callback/:provider_name/:site_api_key",
  siteController.getSiteIdBySiteApiKey,
  OAuthController.getOAuthCredentials,
  OAuthController.getToken,
  OAuthController.getUserData,
  OAuthController.checkUser,
  jwtMiddleware.generateRefreshToken,
  sessionController.addNewSession,
  OAuthController.oauthLoginRedirect
);

router.post(
  "/user/:site_id/:provider_id",
  OAuthController.addUserOauthRelation,
  jwtMiddleware.generateRefreshToken,
  sessionController.addNewSession,
  OAuthController.oauthLoginRedirect
);

/* 
=======================================================================================
 Endpoints related to fetching existing OAuth IDs and keys, adding new ones, and updating
=======================================================================================
*/

router.get(
  "/sites/:site_id/providers/:provider_name/credentials",
  jwtMiddleware.verifyToken,
  roleController.isAuthorizedSiteClient,
  OAuthController.getOAuthCredentials,
  OAuthController.returnOAuthCredentials
);

router.post(
  "/sites/:site_id/providers/:provider_name/credentials",
  jwtMiddleware.verifyToken,
  roleController.isAuthorizedSiteClient,
  OAuthController.addClientIDandSecret
);

router.put(
  "/sites/:site_id/providers/:provider_name/credentials",
  jwtMiddleware.verifyToken,
  roleController.isAuthorizedSiteClient,
  OAuthController.updateClientIDandSecret
);

module.exports = router;
