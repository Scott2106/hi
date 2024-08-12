const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.addNewUserRole = async (data) => {
    const { user_id, site_id, role_permission_id } = data;
    try {
        const response = await prisma.um_user_site_role_permission.create({
            data: {
                user_id: user_id,
                site_id: site_id,
                role_permission_id: role_permission_id
            }
        });
        return response;
    } catch (error) {
        throw new Error(error);
    }
}