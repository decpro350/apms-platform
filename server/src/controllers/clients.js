const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all clients
// @route   GET /api/v1/clients
// @access  Private (Provider Admin only)
const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { properties: true, users: true }
        }
      }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single client
// @route   GET /api/v1/clients/:id
// @access  Private (Provider Admin only)
const getClient = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        properties: true,
        contacts: true,
        users: {
          where: { role: 'CLIENT_OWNER' }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create client
// @route   POST /api/v1/clients
// @access  Private (Provider Admin only)
const createClient = async (req, res) => {
  try {
    const client = await prisma.client.create({
      data: req.body
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update client
// @route   PUT /api/v1/clients/:id
// @access  Private (Provider Admin only)
const updateClient = async (req, res) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete client
// @route   DELETE /api/v1/clients/:id
// @access  Private (Provider Admin only)
const deleteClient = async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
};
