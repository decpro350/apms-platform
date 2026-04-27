const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get estimates
// @route   GET /api/v1/estimates
const getEstimates = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'CLIENT_OWNER') {
      query = {
        workOrder: { clientId: req.user.clientId }
      };
    }

    const estimates = await prisma.estimate.findMany({
      where: query,
      include: {
        workOrder: {
          select: { title: true, number: true }
        }
      }
    });

    res.json(estimates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create estimate
// @route   POST /api/v1/estimates
const createEstimate = async (req, res) => {
  try {
    const { workOrderId, amount, description } = req.body;

    const wo = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { client: true }
    });

    if (!wo) return res.status(404).json({ message: 'Work Order not found' });

    // Check against threshold
    const needsApproval = amount > wo.client.defaultApprovalThreshold;

    const estimate = await prisma.estimate.create({
      data: {
        workOrderId,
        amount: parseFloat(amount),
        description,
        approvalStatus: needsApproval ? 'PENDING' : 'NOT_REQUIRED'
      }
    });

    // Notify client if pending
    if (needsApproval) {
      // Find client owner users
      const owners = await prisma.user.findMany({
        where: { clientId: wo.clientId, role: 'CLIENT_OWNER' }
      });

      for (const owner of owners) {
        await prisma.notification.create({
          data: {
            userId: owner.id,
            title: 'Approval Required',
            message: `Work Order #${wo.number} requires your approval. Amount: $${amount}`,
            link: `/dashboard/approvals/${estimate.id}`
          }
        });
      }
    }

    res.status(201).json(estimate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve/Reject estimate
// @route   POST /api/v1/estimates/:id/approve
const approveEstimate = async (req, res) => {
  try {
    const { action, note } = req.body; // action: 'APPROVED' or 'REJECTED'

    const estimate = await prisma.estimate.findUnique({
      where: { id: req.params.id },
      include: { workOrder: true }
    });

    if (!estimate) return res.status(404).json({ message: 'Estimate not found' });

    // Scoping check
    if (estimate.workOrder.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.estimate.update({
      where: { id: req.params.id },
      data: { approvalStatus: action }
    });

    await prisma.approval.create({
      data: {
        estimateId: estimate.id,
        userId: req.user.id,
        action,
        note
      }
    });

    res.json({ message: `Estimate ${action.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getEstimates,
  createEstimate,
  approveEstimate
};
