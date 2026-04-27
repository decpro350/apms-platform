const express = require('express');
const router = express.Router();
const { 
  getMessages, 
  createMessage 
} = require('../controllers/messages');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/:workOrderId')
  .get(getMessages)
  .post(createMessage);

module.exports = router;
