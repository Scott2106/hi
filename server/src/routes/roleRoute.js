const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const rolePermissionController = require("../controllers/rolePermissionController");
const userSiteRolePermissionController = require("../controllers/userSiteRolePermissionController");
const requestController = require("../controllers/requestController");
const taskController = require("../controllers/taskController");

const jwtMiddleware = require("../middlewares/jwtMiddleware");

// Role Route
router.put("/site_client/",
    jwtMiddleware.verifyToken,
    roleController.isOwnerOrSiteAdmin, 
    roleController.updateUserRoleByOwnerOrAdmin,
    userSiteRolePermissionController.addNewUserRole,
    jwtMiddleware.generateResetPasswordToken,
    requestController.checkRequest,
    taskController.recordForgotPasswordTask,
); 

router.get("/role_permission", rolePermissionController.getAllRolePermissions); 


module.exports = router;

