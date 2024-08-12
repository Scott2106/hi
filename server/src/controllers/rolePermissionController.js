const rolePermissionModel = require("../models/rolePermissionModel");

module.exports.checkUserSiteRolePermission = async (req, res, next) => {
  try {
    const { user_id } = res.locals;
    const { site_id } = req.params;
    const data = { user_id, site_id };

    const response = await rolePermissionModel.getUserRolePermission(data);
    if (response === null) {
      res.status(404).json({
        error: `No Role Permission found for user.`,
      });
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Retrieving Role Permission Id",
      error: error.message,
    };
    res.status(500).json(errMsg);
  }
};

module.exports.getAllRolePermissions = async (req, res) => {
  try {
    const rolePermissions = await rolePermissionModel.getAllRolePermissions();
    if (rolePermissions.length === 0) {
      res.status(404).json({ message: "No Role Permissions found." });
    }
    res.status(200).json(rolePermissions);
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Retrieving All Role Permissions",
      error: error.message,
    };
    res.status(500).json(errMsg);
  }
}