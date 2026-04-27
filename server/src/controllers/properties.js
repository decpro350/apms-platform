const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all properties (scoped by client if CLIENT_OWNER)
// @route   GET /api/v1/properties
// @access  Private
const getProperties = async (req, res) => {
  try {
    let query = {};

    // Scoping for Client Owners
    if (req.user.role === 'CLIENT_OWNER') {
      query.clientId = req.user.clientId;
    }

    const properties = await prisma.property.findMany({
      where: query,
      include: {
        client: {
          select: { name: true }
        },
        _count: {
          select: { buildings: true, workOrders: true }
        }
      }
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Private
const getProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        buildings: {
          include: {
            units: true
          }
        },
        client: true
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Scoping check
    if (req.user.role === 'CLIENT_OWNER' && property.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Not authorized to view this property' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create property
// @route   POST /api/v1/properties
// @access  Private (Provider Admin, Client Owner)
const createProperty = async (req, res) => {
  try {
    const { clientId, name, address, type, emergencyContact, notes } = req.body;

    // Ensure Client Owner can only create for their own client
    const targetClientId = req.user.role === 'CLIENT_OWNER' ? req.user.clientId : clientId;

    const property = await prisma.property.create({
      data: {
        clientId: targetClientId,
        name,
        address,
        type,
        emergencyContact,
        notes
      }
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Provider Admin, Client Owner)
const updateProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({ where: { id: req.params.id } });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Scoping check
    if (req.user.role === 'CLIENT_OWNER' && property.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updatedProperty = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Provider Admin only)
const deleteProperty = async (req, res) => {
  try {
    await prisma.property.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
};
