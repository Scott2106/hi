const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.checkClientRolePermission = async (data) => {
    const {site_id, role_permission_id, user_id} = data;
    try{
        const checkUserByRolePermissionId = await prisma.um_user_site_role_permission.findFirst({
            where: {
                user_id : parseInt(user_id),
                site_id: parseInt(site_id),
                role_permission_id: parseInt(role_permission_id)
            },
        });

        if (!checkUserByRolePermissionId) {
            return null;
        }

        return checkUserByRolePermissionId;
    } catch (error) {
        console.error('Error checking role:', error);
        throw error;
    }
}

module.exports.getRolePermissionByUserId = async (data) => {
    const {site_id, user_id} = data;
    try{
        const getRolePermission = await prisma.um_user_site_role_permission.findFirst({
            where: {
                user_id : parseInt(user_id),
                site_id: parseInt(site_id),
            },
            select: {
                user_site_role_permission_id : true,
                role_permission_id : true,
            }
        });

        if (!getRolePermission) {
            return null;
        }

        return getRolePermission;
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
}    

module.exports.updateRoleByUserId = async (data) => {
    const { user_site_role_permission_id, role_permission_id } = data;
    try {
        const updatedRolePermission = await prisma.um_user_site_role_permission.update({
            where: {
                user_site_role_permission_id: parseInt(user_site_role_permission_id),
            },
            data: {
                role_permission_id : parseInt(role_permission_id),
            }
        });

        if (!updatedRolePermission) {
            return null;
        }

        return updatedRolePermission;

    } catch (error) {
        if (error.code === 'P2025') { // Prisma error code for record not found
            return null; 
        }
        console.error('Error updating role:', error);
        throw error; // Re-throw other errors
    }
};