const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getNotifications);
router.put('/read', markAsRead);

module.exports = router;
