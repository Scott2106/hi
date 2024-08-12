const userSiteRolePermissionModel = require("../models/userSiteRolePermissionModel");

module.exports.addNewUserRole = async (req, res, next) => {
    
        const user_id = res.locals.user_id;
        const site_id = res.locals.site_id;
        const role_permission_id = 5; // standard user role permission id
        const data = { user_id, site_id, role_permission_id };
    try {
        const response = await userSiteRolePermissionModel.addNewUserRole(data);
        if (response) {
            next();
        } else {
            res.status(400).json({ message: "Error Adding New User Role" });
        }
    } catch (error) {
        const errMsg = {
        errorFunction: "Error Adding New User Role",
        error: error.message,
        };
        res.status(500).json(errMsg);
    }
}