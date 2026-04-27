const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get invoices
// @route   GET /api/v1/invoices
const getInvoices = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'CLIENT_OWNER') {
      query.clientId = req.user.clientId;
    }

    const invoices = await prisma.invoice.findMany({
      where: query,
      include: {
        client: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single invoice
// @route   GET /api/v1/invoices/:id
const getInvoice = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        lineItems: true,
        payments: true
      }
    });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Scoping check
    if (req.user.role === 'CLIENT_OWNER' && invoice.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create manual invoice
// @route   POST /api/v1/invoices
const createInvoice = async (req, res) => {
  try {
    const { clientId, dueDate, lineItems } = req.body;

    const totalAmount = lineItems.reduce((acc, item) => acc + item.amount, 0);

    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        dueDate: new Date(dueDate),
        totalAmount,
        lineItems: {
          create: lineItems
        }
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate invoice from work orders
// @route   POST /api/v1/invoices/generate
const generateInvoiceFromWorkOrder = async (req, res) => {
  try {
    const { workOrderIds, clientId } = req.body;

    const workOrders = await prisma.workOrder.findMany({
      where: { id: { in: workOrderIds } },
      include: { costs: true }
    });

    let lineItems = [];
    let total = 0;

    for (const wo of workOrders) {
      // Calculate total for this WO from its costs
      const woTotal = wo.costs.reduce((acc, c) => acc + c.amount, 0);
      
      lineItems.push({
        workOrderId: wo.id,
        description: `Work Order #${wo.number}: ${wo.title}`,
        amount: woTotal
      });
      
      total += woTotal;
    }

    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        totalAmount: total,
        lineItems: {
          create: lineItems
        }
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update invoice status
// @route   PUT /api/v1/invoices/:id
const updateInvoice = async (req, res) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  generateInvoiceFromWorkOrder
};
