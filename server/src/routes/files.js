const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { 
  uploadFile, 
  getWorkOrderFiles 
} = require('../controllers/files');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/work-order/:workOrderId', getWorkOrderFiles);

module.exports = router;
