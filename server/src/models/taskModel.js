const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.generateTaskQueue = async (data) => {
  const {
    p_task_name,
    p_table_name,
    p_pk_name,
    p_payload,
    p_priority,
    p_task_by_user,
    p_site_id,
  } = data;

  const prismaStatement = await prisma.$executeRaw`
    CALL create_task(
      ${p_task_name}::VARCHAR,
      ${p_table_name}::VARCHAR,
      ${p_pk_name}::VARCHAR,
      ${p_payload}::JSONB,
      ${p_priority}::VARCHAR,
      ${p_task_by_user}::INT,
      ${p_site_id}::INT
    );
  `;

  return prismaStatement;
};

