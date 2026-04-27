const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/reports');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/stats', authorize('PROVIDER_ADMIN', 'CLIENT_OWNER'), getDashboardStats);

module.exports = router;
