const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const { role, clientId } = req.user;
    let where = {};

    if (role === 'CLIENT_OWNER') {
      where.clientId = clientId;
    }

    const [
      totalOrders,
      openOrders,
      emergencyOrders,
      completedOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.workOrder.count({ where }),
      prisma.workOrder.count({ where: { ...where, status: { in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.workOrder.count({ where: { ...where, priority: 'EMERGENCY' } }),
      prisma.workOrder.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.workOrderCost.aggregate({
        where: { workOrder: where },
        _sum: { amount: true }
      })
    ]);

    // Average completion time (simplified)
    const completedWithDates = await prisma.workOrder.findMany({
      where: { ...where, status: 'COMPLETED', NOT: { startedAt: null, completedAt: null } },
      select: { startedAt: true, completedAt: true }
    });

    const avgCompletionTime = completedWithDates.length > 0 
      ? completedWithDates.reduce((acc, wo) => acc + (wo.completedAt - wo.startedAt), 0) / completedWithDates.length / (1000 * 60 * 60)
      : 0;

    res.json({
      totalOrders,
      openOrders,
      emergencyOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      avgCompletionTime: avgCompletionTime.toFixed(1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardStats };
