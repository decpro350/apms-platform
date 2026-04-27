const express = require('express');
const router = express.Router();
const { 
  getInvoices, 
  getInvoice, 
  createInvoice, 
  updateInvoice, 
  generateInvoiceFromWorkOrder 
} = require('../controllers/invoices');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(authorize('PROVIDER_ADMIN'), createInvoice);

router.post('/generate', authorize('PROVIDER_ADMIN'), generateInvoiceFromWorkOrder);

router.route('/:id')
  .get(getInvoice)
  .put(authorize('PROVIDER_ADMIN'), updateInvoice);

module.exports = router;
