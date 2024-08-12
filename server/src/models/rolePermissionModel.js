const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getUserRolePermission = async (data) => {
  const { user_id, site_id } = data;

  const rolePermisson = await prisma.um_user_site_role_permission.findFirst({
    where: {
      user_id: parseInt(user_id),
      site_id: parseInt(site_id),
    },
    select: {
      role_permission_id: true,
    },
  });

  return rolePermisson;
};

module.exports.getAllRolePermissions = async () => {
  const rolePermissions = await prisma.um_role_permission.findMany({
    include: {
      um_role: true,
    },
  });

  return rolePermissions;
}