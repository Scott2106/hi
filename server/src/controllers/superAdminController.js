const roleModel = require("../models/roleModel");
const userModel = require("../models/userModel");
const validator = require("validator");

module.exports.checkSuperAdmin = async (req, res, next) => {;
  try {  
    const user_id = res.locals.user_id;
    const temp_site_id = res.locals.site_id;
    const result = await roleModel.getRolePermissionByUserId({
      site_id: 1,
      user_id,
    });

    console.log("result:", result);
    if(!result) {
        return res.status(404).json({ message: "User Not Found" });
    } else {
      if (result.role_permission_id !== 1) {
        return res.status(401).json({ message: "Unauthorized" });
      } else{
        next();
      }
    }

  } catch (error) {
    console.error("Error checking super admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsersWithRoleAndSite();

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteUserByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await userModel.deleteUserByUserId(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.updateUserRole = async (req, res) => {
  try {
    // get data from body
    const { user_id, site_id, role_permission_id } = req.body;
    // check if userId, siteId, rolePermissionId are valid
    if (!user_id || !site_id || !role_permission_id) {
      return res.status(400).json({ message: "Invalid data" });
    }

    userModel.updateUserRole(user_id, site_id, role_permission_id);
    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
      //====== (Logging)
      logger.info('Request logged', {
        request_method: req.method,
        api_requested: req.originalUrl,
        user_ip: req.ip,
        user_os: req.headers['user-agent'],
        error_message: error, // or the error message if an error occurred
        site_id: req.body.site_id,
        user_id: req.body.user_id
      });
      // ==========
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteUserFromSite = async (req, res) => {
  try {
    const { userId, siteId } = req.params;
    const deletedUser = await userModel.deleteUserFromSite(userId, siteId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
        //====== (Logging)
        logger.info('Request logged', {
          request_method: req.method,
          api_requested: req.originalUrl,
          user_ip: req.ip,
          user_os: req.headers['user-agent'],
          error_message: error, // or the error message if an error occurred
          site_id: req.params.siteId,
          user_id: req.params.userId
        });
        // ==========
    console.error("Error deleting user from site:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteManyUserFromSite = async (req, res) => {
  try {
    const { dataArr } = req.body;
    if (!dataArr) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const deletedUsers = await userModel.deleteManyUserFromSite(dataArr);
    return res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users from site:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
