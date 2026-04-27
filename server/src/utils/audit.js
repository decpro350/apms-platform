const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const logAudit = async (userId, action, entityType, entityId, oldValue = null, newValue = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId: entityId.toString(),
        oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : null,
        newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : null,
      }
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

module.exports = { logAudit };
