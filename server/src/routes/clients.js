const express = require('express');
const router = express.Router();
const { 
  getClients, 
  getClient, 
  createClient, 
  updateClient, 
  deleteClient 
} = require('../controllers/clients');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('PROVIDER_ADMIN'));

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
