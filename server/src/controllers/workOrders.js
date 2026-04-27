const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all work orders
// @route   GET /api/v1/work-orders
// @access  Private
const getWorkOrders = async (req, res) => {
  try {
    let query = {};

    // Scoping based on role
    if (req.user.role === 'CLIENT_OWNER') {
      query.clientId = req.user.clientId;
    } else if (req.user.role === 'TENANT') {
      query.tenantId = (await prisma.tenant.findUnique({ where: { userId: req.user.id } })).id;
    } else if (req.user.role === 'TECHNICIAN') {
      query.assignments = {
        some: {
          technicianId: (await prisma.technician.findUnique({ where: { userId: req.user.id } })).id
        }
      };
    }

    const workOrders = await prisma.workOrder.findMany({
      where: query,
      include: {
        client: { select: { name: true } },
        property: { select: { name: true } },
        unit: { select: { number: true } },
        category: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(workOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single work order
// @route   GET /api/v1/work-orders/:id
// @access  Private
const getWorkOrder = async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        property: true,
        unit: true,
        tenant: { include: { user: true } },
        category: true,
        assignments: {
          include: {
            technician: { include: { user: true } },
            vendor: { include: { user: true } }
          }
        },
        costs: true,
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'asc' }
        },
        files: true,
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    // Basic scoping check
    if (req.user.role === 'CLIENT_OWNER' && workOrder.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(workOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create work order
// @route   POST /api/v1/work-orders
// @access  Private
const createWorkOrder = async (req, res) => {
  try {
    const { title, description, priority, propertyId, unitId, categoryId, permissionToEnter } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    let tenantId = null;
    if (req.user.role === 'TENANT') {
      const tenant = await prisma.tenant.findUnique({ where: { userId: req.user.id } });
      tenantId = tenant.id;
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        title,
        description,
        priority,
        clientId: property.clientId,
        propertyId,
        unitId,
        tenantId,
        categoryId,
        permissionToEnter
      }
    });

    res.status(201).json(workOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update work order
// @route   PUT /api/v1/work-orders/:id
// @access  Private
const updateWorkOrder = async (req, res) => {
  try {
    const { status, priority, description, scheduledAt } = req.body;

    const workOrder = await prisma.workOrder.update({
      where: { id: req.params.id },
      data: {
        status,
        priority,
        description,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined
      }
    });

    // Add to history
    await prisma.workOrderStatusHistory.create({
      data: {
        workOrderId: req.params.id,
        status: workOrder.status,
        changedBy: req.user.id
      }
    });

    res.json(workOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder
};
