const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getUser = async (data) => {
  const { site_id, provider_id, oauth_sub_id } = data;
  const user = await prisma.um_user.findFirst({
    where: {
      um_authentication: {
        some: {
          site_id: parseInt(site_id),
          provider_id: parseInt(provider_id),
          oauth_sub_id: oauth_sub_id,
        },
      },
    },
  });
};

// A procedure to register a new user
// 1st step: Add email and default status:
// pending(2) to um_user table
// 2nd step: Add user_id, site_id and hashed password
// to um_authentication table
// 3rd step: Add user_id, site_id and role_permission_id (5) 
// to um_user_site_role_permission table
module.exports.insertNewUser = async (data) => {
  const { email, site_id, hash } = data;
  const prismaStatement = await prisma.$queryRaw`
  SELECT register_user(
    ${email}::VARCHAR,
    ${site_id}::INT,
    ${hash}::VARCHAR
  );
`;
  return prismaStatement;
};

// HEATHER
module.exports.insertNewUserNoProvider = async (data) => {
  const { email } = data;
  const newUser = await prisma.um_user.create({
    data: {
      email,
      status_id: 1,
    },
  });

  return newUser;
};

module.exports.insertNewUserSiteRole = async (param) => {
  const newUser = await prisma.um_user_site_role.create({
    data: {
      um_user: {
        connect: {
          user_id: param.user_id,
        },
      },
      um_site: {
        connect: {
          site_id: param.site_id,
        },
      },
    },
  });

  return newUser;
};

module.exports.checkEmail = async (data) => {
  const { email } = data;
  const userEmail = await prisma.um_user.findUnique({
    where: {
      email,
    },
    select: {
      user_id: true,
      status_id: true,
    },
  });

  return userEmail;
};

module.exports.findUserByIdandSite = async (data) => {
  const user = await prisma.um_authentication.findFirst({
    where: {
      user_id: data.user_id,
      site_id: data.site_id,
    },
  });

  return user;
};

module.exports.findUserSiteRole = async (data) => {
  const user = await prisma.um_user_site_role.findFirst({
    where: {
      user_id: data.user_id,
      site_id: data.site_id,
    },
  });

  return user;
};

module.exports.findUserById = async (data) => {
  const user = await prisma.um_user.findUnique({
    where: {
      user_id: data.user_id,
    },
  });

  return user;
};

module.exports.getAllUsersWithRoleAndSite = async () => {
  const users = await prisma.um_user_site_role_permission.findMany({
    include: {
      um_user: true,
      um_site: true,
      um_role_permission: {
        include: {
          um_role: true,
        },
      },
    },
    orderBy: [{ site_id: "asc" }, { role_permission_id: "asc" }],
  });

  return users.map((user) => {
    return {
      user_id: user.user_id,
      site_id: user.site_id,
      role_id: user.um_role_permission.role_id,
      email: user.um_user.email,
      site_name: user.um_site.site_name,
      role_name: user.um_role_permission.um_role.role_name,
    };
  });
};

module.exports.updateUserRole = async (userId, siteId, rolePermissionId) => {
  const updatedUser = await prisma.um_user_site_role_permission.update({
    where: {
      user_id_site_id: {
        user_id: parseInt(userId),
        site_id: parseInt(siteId),
      },
    },
    data: {
      role_permission_id: parseInt(rolePermissionId),
    },
  });

  return updatedUser;
};

module.exports.updateUserRole = async (userId, siteId, rolePermissionId) => {
  const updatedUser = await prisma.um_user_site_role_permission.update({
    where: {
      user_id_site_id: {
        user_id: parseInt(userId),
        site_id: parseInt(siteId),
      },
    },
    data: {
      role_permission_id: parseInt(rolePermissionId),
    },
  });

  return updatedUser;
};

module.exports.updateStatus = async (data) => {
  const { user_id, status_id } = data;
  const updatedUser = await prisma.um_user.updateMany({
    where: {
      user_id: parseInt(user_id),
    },
    data: {
      status_id: parseInt(status_id),
    },
  });

  return updatedUser;
};

module.exports.deleteUserByUserId = async (userId) => {
  const deletedUser = await prisma.um_user.delete({
    where: {
      user_id: parseInt(userId),
    },
  });

  return deletedUser;
};

module.exports.updatePasswordById = async (data) => {
  const { user_id, site_id, hash } = data;
  const prismaStatement = await prisma.um_authentication.updateMany({
    where: {
      user_id,
      site_id,
    },
    data: {
      password: hash,
    },
  });

  return prismaStatement;
};

module.exports.deleteUserFromSite = async (userId, siteId) => {
  const deletedUser = await prisma.um_user_site_role_permission.delete({
    where: {
      user_id_site_id: {
        user_id: parseInt(userId),
        site_id: parseInt(siteId),
      },
    },
  });

  await prisma.um_authentication.delete({
    where: {
      user_id_site_id: {
        user_id: parseInt(userId),
        site_id: parseInt(siteId),
      },
    },
  });

  return deletedUser;
};

module.exports.deleteManyUserFromSite = async (dataArr) => {
  const deletedUser = await prisma.um_user_site_role_permission.deleteMany({
    where: {
      OR: dataArr.map((data) => ({
        AND: [
          { user_id: parseInt(data[0].user_id) },
          { site_id: parseInt(data[0].site_id) },
        ],
      })),
    },
  });

  await prisma.um_authentication.deleteMany({
    where: {
      OR: dataArr.map((data) => ({
        AND: [
          { user_id: parseInt(data[0].user_id) },
          { site_id: parseInt(data[0].site_id) },
        ],
      })),
    },
  });

  return deletedUser;
};

module.exports.updateEmailVerification = async (data) => {
  const { user_id, site_id } = data;
  const updatedUser = await prisma.um_authentication.updateMany({
    where: {
      user_id,
      site_id,
    },
    data: {
      email_verified_at: new Date(),
    },
  });

  return updatedUser;
};

module.exports.getUserPassword = async (data) => {
  const { user_id, site_id } = data;
  const user = await prisma.um_authentication.findFirst({
    where: {
      user_id,
      site_id,
    },
    select: {
      password: true,
    },
  });

  return user;
};
