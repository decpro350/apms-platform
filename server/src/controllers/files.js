const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Upload file and link to entity
// @route   POST /api/v1/files/upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { workOrderId, visibility, caption } = req.body;

    const file = await prisma.workOrderFile.create({
      data: {
        workOrderId,
        userId: req.user.id,
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        visibility: visibility || 'INTERNAL',
        caption
      }
    });

    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get files for work order
// @route   GET /api/v1/files/work-order/:workOrderId
const getWorkOrderFiles = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const { role } = req.user;

    // Visibility logic (same as messages)
    let visibilityFilter = [];
    if (role === 'PROVIDER_ADMIN') {
      visibilityFilter = ['TENANT_VISIBLE', 'CLIENT_VISIBLE', 'VENDOR_VISIBLE', 'INTERNAL'];
    } else if (role === 'CLIENT_OWNER') {
      visibilityFilter = ['CLIENT_VISIBLE'];
    } else if (role === 'TENANT') {
      visibilityFilter = ['TENANT_VISIBLE'];
    } else if (role === 'VENDOR') {
      visibilityFilter = ['VENDOR_VISIBLE'];
    }

    const files = await prisma.workOrderFile.findMany({
      where: {
        workOrderId,
        visibility: { in: visibilityFilter }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  uploadFile,
  getWorkOrderFiles
};
