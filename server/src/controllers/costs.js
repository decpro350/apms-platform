const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get costs for a work order
// @route   GET /api/v1/costs/:workOrderId
const getWorkOrderCosts = async (req, res) => {
  try {
    const { workOrderId } = req.params;

    const costs = await prisma.workOrderCost.findMany({
      where: { workOrderId }
    });

    // Calculate totals based on the formula
    // labor_total = labor_hours * labor_rate
    // subtotal = labor_total + material_cost + vendor_cost + markup + trip_charge + emergency_fee
    // total = subtotal + tax

    const summary = costs.reduce((acc, cost) => {
      const amount = parseFloat(cost.amount);
      if (cost.type.toLowerCase() === 'tax') {
        acc.tax += amount;
      } else {
        acc.subtotal += amount;
      }
      return acc;
    }, { subtotal: 0, tax: 0 });

    summary.total = summary.subtotal + summary.tax;

    res.json({ costs, summary });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add cost to work order
// @route   POST /api/v1/costs/:workOrderId
const addCost = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const { type, amount, description } = req.body;

    const cost = await prisma.workOrderCost.create({
      data: {
        workOrderId,
        type,
        amount: parseFloat(amount),
        description
      }
    });

    res.status(201).json(cost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete cost
// @route   DELETE /api/v1/costs/:id
const deleteCost = async (req, res) => {
  try {
    await prisma.workOrderCost.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Cost removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getWorkOrderCosts,
  addCost,
  deleteCost
};
