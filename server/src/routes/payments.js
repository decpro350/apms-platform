const express = require('express');
const router = express.Router();
const { 
  getPayments, 
  createPayment 
} = require('../controllers/payments');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('PROVIDER_ADMIN', 'CLIENT_OWNER'), getPayments)
  .post(authorize('CLIENT_OWNER'), createPayment);

module.exports = router;
