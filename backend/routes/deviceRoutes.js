const express = require('express');
const router = express.Router();
const {
  getAllDevices,
  getDevicesBySite,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
} = require('../controllers/deviceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public for all logged in users — clients need devices for raise ticket
router.get('/', protect, getAllDevices);
router.get('/site/:siteId', protect, getDevicesBySite);
router.get('/:id', protect, getDeviceById);

// Admin only
router.post('/', protect, isAdmin, createDevice);
router.put('/:id', protect, isAdmin, updateDevice);
router.delete('/:id', protect, isAdmin, deleteDevice);

module.exports = router;