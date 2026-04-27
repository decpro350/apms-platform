const express = require('express');
const router = express.Router();
const { 
  getWorkOrderCosts, 
  addCost, 
  deleteCost 
} = require('../controllers/costs');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/:workOrderId')
  .get(getWorkOrderCosts)
  .post(authorize('PROVIDER_ADMIN', 'TECHNICIAN'), addCost);

router.delete('/:id', authorize('PROVIDER_ADMIN'), deleteCost);

module.exports = router;
