const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get messages for a work order (with visibility filtering)
// @route   GET /api/v1/messages/:workOrderId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const { role } = req.user;

    let visibilityFilter = [];

    // Define visibility rules
    if (role === 'PROVIDER_ADMIN') {
      visibilityFilter = ['TENANT_VISIBLE', 'CLIENT_VISIBLE', 'VENDOR_VISIBLE', 'INTERNAL'];
    } else if (role === 'CLIENT_OWNER') {
      visibilityFilter = ['CLIENT_VISIBLE'];
    } else if (role === 'TENANT') {
      visibilityFilter = ['TENANT_VISIBLE'];
    } else if (role === 'VENDOR') {
      visibilityFilter = ['VENDOR_VISIBLE'];
    } else if (role === 'TECHNICIAN') {
      visibilityFilter = ['INTERNAL', 'VENDOR_VISIBLE']; // Techs usually see internal notes
    }

    const messages = await prisma.workOrderMessage.findMany({
      where: {
        workOrderId,
        visibility: { in: visibilityFilter }
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create message
// @route   POST /api/v1/messages/:workOrderId
// @access  Private
const createMessage = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const { content, visibility } = req.body;

    const message = await prisma.workOrderMessage.create({
      data: {
        workOrderId,
        userId: req.user.id,
        content,
        visibility: visibility || 'INTERNAL'
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true }
        }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMessages,
  createMessage
};
