const express = require('express');
const router = express.Router();
const { 
  getProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty 
} = require('../controllers/properties');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProperties)
  .post(authorize('PROVIDER_ADMIN', 'CLIENT_OWNER'), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(authorize('PROVIDER_ADMIN', 'CLIENT_OWNER'), updateProperty)
  .delete(authorize('PROVIDER_ADMIN'), deleteProperty);

module.exports = router;
