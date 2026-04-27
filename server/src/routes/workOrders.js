const express = require('express');
const router = express.Router();
const { 
  getWorkOrders, 
  getWorkOrder, 
  createWorkOrder, 
  updateWorkOrder 
} = require('../controllers/workOrders');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getWorkOrders)
  .post(createWorkOrder);

router.route('/:id')
  .get(getWorkOrder)
  .put(authorize('PROVIDER_ADMIN', 'TECHNICIAN'), updateWorkOrder);

module.exports = router;
