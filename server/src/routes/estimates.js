const express = require('express');
const router = express.Router();
const { 
  createEstimate, 
  getEstimates, 
  approveEstimate 
} = require('../controllers/estimates');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getEstimates)
  .post(authorize('PROVIDER_ADMIN'), createEstimate);

router.post('/:id/approve', authorize('CLIENT_OWNER'), approveEstimate);

module.exports = router;
