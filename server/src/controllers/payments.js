const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get payments
// @route   GET /api/v1/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'CLIENT_OWNER') {
      query = {
        invoice: {
          clientId: req.user.clientId
        }
      };
    }

    const payments = await prisma.payment.findMany({
      where: query,
      include: {
        invoice: true
      }
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Process payment
// @route   POST /api/v1/payments
// @access  Private (Client Owner)
const createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, method, reference } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Scoping check
    if (invoice.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Not authorized to pay this invoice' });
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        reference
      }
    });

    // Update invoice status if fully paid (simple logic for now)
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPayments,
  createPayment
};
