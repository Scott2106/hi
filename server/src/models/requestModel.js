const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Check if there are any requests by the user for the requested service
module.exports.getRequest = async (data) => {
  const { user_id, site_id, service_id } = data;
  const prismaStatement = await prisma.um_request.findFirst({
    where: {
      user_id,
      site_id,
      service_id,
    },
    select: {
      token: true,
      used: true,
    },
  });
  return prismaStatement;
};

// Insert single request by user of requested service
module.exports.insertRequest = async (data) => {
  const { user_id, site_id, service_id, token } = data;
  const prismaStatement = await prisma.um_request.create({
    data: {
      user_id: parseInt(user_id),
      site_id: parseInt(site_id),
      service_id: parseInt(service_id),
      token,
    },
  });
  return prismaStatement;
};

// Update single request by user of requested service
module.exports.updateRequest = async (data) => {
  const { user_id, site_id, service_id, token } = data;
  const prismaStatement = await prisma.um_request.updateMany({
    where: {
      user_id,
      site_id,
      service_id,
    },
    data: {
      token,
      used: false,
    },
  });
  return prismaStatement;
};

module.exports.updateUseState = async (data) => {
  const { token } = data;
  const prismaStatement = await prisma.um_request.updateMany({
    where: {
      token,
    },
    data: {
      used: true,
    },
  });
  return prismaStatement;
};
