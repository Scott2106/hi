const roleModel = require("../models/roleModel");
const authModel = require("../models/authModel");
const userModel = require("../models/userModel");
const validator = require("validator");

module.exports.isAuthIncUser = async (req, res, next) => {
  const role_permission_id = 5; // role id for normal user
  const user_id = res.locals.user_id;
  const site_id = 1; // authInc siteId
  const data = { site_id, role_permission_id, user_id };

  const isAuthINCUser = await roleModel.checkClientRolePermission(data);
  if (isAuthINCUser) {
    next();
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports.isSuperAdmin = async (req, res, next) => {
  const site_id = 1; // authInc siteId
  const role_permission_id = 1; // super admin role id
  const user_id = res.locals.user_id;
  const data = { site_id, role_permission_id, user_id };

  try {
    const isSuperAdmin = await roleModel.checkClientRolePermission(data);
    if (isSuperAdmin) {
      res.locals.clientRole = role_id;
      console.log("isSuperAdmin:");
      next();
    } else {
      return res.status(404).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.isAuthorizedSiteClient = async (req, res, next) => {
  const user_id = res.locals.user_id;
  const site_id = req.params.site_id | req.body.site_id;

  if (!user_id || !site_id) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  if (
    !validator.isNumeric(String(user_id)) &&
    !validator.isNumeric(String(site_id))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid user_id or site_id format" });
  }

  const data1 = { site_id, role_permission_id: 2, user_id }; // site owner role id
  const data2 = { site_id, role_permission_id: 3, user_id }; // site admin role id
  const data3 = { site_id, role_permission_id: 4, user_id }; // manager role id

  try {
    const isSiteOwner = await roleModel.checkClientRolePermission(data1);
    const isSiteAdmin = await roleModel.checkClientRolePermission(data2);
    const isManager = await roleModel.checkClientRolePermission(data3);
    if (isSiteAdmin || isSiteOwner) {
      if (isSiteOwner) {
        console.log("isSiteOwner:");
      } else if (isSiteAdmin) {
        console.log("isSiteAdmin:");
      } else if (isManager) {
        console.log("isManager:");
      }
      res.locals.site_id = site_id;
      next();
    } else {
      return res.status(403).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.isOwnerOrSiteAdmin = async (req, res, next) => {
  const user_id = res.locals.user_id;
  // to check site id, there should be site_id in the parameter
  // e.g. to change user's role, the requirements are user_id, updated_role_id and site_id of the user
  // so, the site_id should be in the parameter and this is also the one to check if client trying to do this process poccess the required role
  const site_id = req.body.site_id;
  const data1 = { site_id, role_permission_id: 2, user_id }; // site owner role id
  const data2 = { site_id, role_permission_id: 3, user_id }; // site admin role id

  try {
    const isSiteOwner = await roleModel.checkClientRolePermission(data1);
    const isSiteAdmin = await roleModel.checkClientRolePermission(data2);
    if (isSiteAdmin || isSiteOwner) {
      if (isSiteOwner) {
        res.locals.client_role_permission_id = 2;
        console.log("isSiteOwner:");
      } else if (isSiteAdmin) {
        res.locals.client_role_permission_id = 3;
        console.log("isSiteAdmin:");
      }
      next();
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  const user_id = res.locals.user_id;
  // to check site id, there should be site_id in the parameter
  // e.g. to change user's role, the requirements are user_id, updated_role_id and site_id of the user
  // so, the site_id should be in the parameter and this is also the one to check if client trying to do this process poccess the required role
  const site_id = req.body.site_id;
  const data1 = { site_id, role_permission_id: 1, user_id }; // super admin role id
  const data2 = { site_id, role_permission_id: 3, user_id }; // site admin role id

  try {
    const isSuperAdmin = await roleModel.checkClientRolePermission(data1);
    const isSiteAdmin = await roleModel.checkClientRolePermission(data2);
    if (isSuperAdmin || isSiteAdmin) {
      if (isSuperAdmin) {
        res.locals.client_role_permission_id = 1;
        console.log("isSuperAdmin:");
      } else if (isSiteAdmin) {
        res.locals.client_role_permission_id = 3;
        console.log("isSiteAdmin:");
      }
      next();
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.isSiteOwner = async (req, res, next) => {
  const role_permission_id = 2; // site owner role id
  const user_id = res.locals.user_id;
  // to check site id, there should be site_id in the parameter
  const site_id = req.body.site_id;
  const data = { site_id, role_permission_id, user_id };

  try {
    const isSiteOwner = await roleModel.checkClientRolePermission(data);
    if (isSiteOwner) {
      res.locals.client_role_permission_id = role_permission_id;
      console.log("isSiteOwner:");
      next();
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.isSiteAdmin = async (req, res, next) => {
  const role_permission_id = 3; // site admin role id
  const user_id = res.locals.user_id;
  // to check site id, there should be site_id in the parameter
  // e.g. to change user's role, the requirements are user_id, updated_role_id and site_id of the user
  // so, the site_id should be in the parameter and this is also the one to check is the person trying to do this process is site admin at that site
  const site_id = req.body.site_id;
  const data = { site_id, role_permission_id, user_id };

  try {
    const isSiteAdmin = await roleModel.checkClientRolePermission(data);
    if (isSiteAdmin) {
      res.locals.client_role_permission_id = role_permission_id;
      console.log("isSiteAdmin:");
      next();
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.isManager = async (req, res, next) => {
  const role_permission_id = 4; // manager role id
  const user_id = res.locals.user_id;
  // to check site id, there should be site_id in the parameter
  const site_id = req.body.site_id;
  const data = { site_id, role_permission_id, user_id };

  try {
    const isManager = await roleModel.checkClientRolePermission(data);
    if (isManager) {
      res.locals.client_role_permission_id = role_permission_id;
      console.log("isManager:");
      next();
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.updateUserRoleByOwnerOrAdmin = async (req, res, next) => {
  const { site_id, user_id, role_permission_id } = req.body; // 44
  const data1 = { site_id, user_id, role_permission_id };
  const client_role_permission_id = res.locals.client_role_permission_id;
  let old_role_permission_id;
  let user_site_role_permission_id;

  // checking if the new role of the user has less power than the client
  if (role_permission_id <= client_role_permission_id) {
    return res.status(403).json({ message: "Action is not allowed" });
  } else {
    // Checking if old role of the user has less power than the client
    try {
      const getRolePermission = await roleModel.getRolePermissionByUserId(
        data1
      );
      old_role_permission_id = getRolePermission.role_permission_id;
      user_site_role_permission_id =
        getRolePermission.user_site_role_permission_id;

      if (old_role_permission_id <= client_role_permission_id) {
        return res.status(403).json({ message: "Action Not Allowed" });
      }
    } catch {
      console.error("Error updating role:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    try {
      const data2 = { user_site_role_permission_id, role_permission_id };
      const updatedRole = await roleModel.updateRoleByUserId(data2);
      if (updatedRole) {
        // checking
        if (old_role_permission_id === 5 && role_permission_id <= 4) {
          // override the client user_id to the user_id from the body for further middleware
          res.locals.user_id = req.body.user_id;
          // check if the user has a record in the user_site_role_permission table for authInc site
          const data3 = { user_id: res.locals.user_id, site_id: 1 };
          try {
            const getAuthRecord = await authModel.getAuthRecord(data3);
            if (!getAuthRecord) {
              // add a new record into the user_site_role_permission table
              const data4 = {
                hash: null,
                user_id: res.locals.user_id,
                site_id: 1,
              };
              try {
                const addedRecord = await authModel.insertNewAuth(data4);
                if (addedRecord) {
                  // Override the site_id to 1 (authInc siteId) for further middleware
                  res.locals.site_id = 1;
                  try {
                    const data5 = { user_id: req.body.user_id };
                    const user = await userModel.findUserById(data5);
                    if (user) {
                      res.locals.email = user.email;
                      next();
                    } else {
                      return res
                        .status(404)
                        .json({ message: "User not found" });
                    }
                  } catch (error) {}
                } else {
                  return res
                    .status(400)
                    .json({ message: "Error adding new Record" });
                }
              } catch (error) {
                console.error("Error inserting new auth record:", error); // Detailed error logging
                return res
                  .status(500)
                  .json({ message: "Internal Server Error.111" });
              }
            } else {
              return res
                .status(200)
                .json({ message: "Role updated successfully" });
            }
          } catch (error) {
            console.error("Error getting auth record:", error); // Detailed error logging
            return res.status(500).json({ message: "Internal Server Error." });
          }
        } else {
          return res.status(200).json({ message: "Role updated successfully" });
        }
      } else {
        return res.status(404).json({ message: "User or site not found" });
      }
    } catch (error) {
      //====== (Logging)
      logger.info("Request logged", {
        request_method: req.method,
        api_requested: req.originalUrl,
        user_ip: req.ip,
        user_os: req.headers["user-agent"],
        error_message: error, // or the error message if an error occurred
        site_id: req.body.site_id,
        user_id: req.body.user_id,
      });
      // ==========
      console.error("Error updating role:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  }
};

//For Site Mangement Team RBAC
module.exports.isAuthorized = async (req, res, next) => {
  // res.locals.user_id will be passed from the jwtMiddleware "VerifyToken"
  const user_id = res.locals.user_id;
  // site_id will be reterieved from the request parameter
  const site_id = req.params.site_id;

  const data = { site_id, user_id };

  try {
    const isAuthorized = await roleModel.getRolePermissionByUserId(data);

    const role_permission_id = isAuthorized.role_permission_id;
    // can modify the role authorization here (Currently super Admin, Site Owner, Site Admin, Manager are authorized)
    if (
      role_permission_id === 1 ||
      role_permission_id === 2 ||
      role_permission_id === 3 ||
      role_permission_id === 4
    ) {
      console.log("Authorized:");
      // next();
      return res.status(200).json({ message: "Authorized" });
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
