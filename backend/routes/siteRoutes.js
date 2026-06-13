// const express = require('express');
// const router = express.Router();
// const {
//   getAllSites,
//   getSiteById,
//   createSite,
//   updateSite,
//   deleteSite
// } = require('../controllers/siteController');
// const { protect, isAdmin } = require('../middleware/authMiddleware');

// router.use(protect, isAdmin);

// router.get('/', getAllSites);
// router.get('/:id', getSiteById);
// router.post('/', createSite);
// router.put('/:id', updateSite);
// router.delete('/:id', deleteSite);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite
} = require('../controllers/siteController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public for all logged in users — clients need this for raise ticket
router.get('/', protect, getAllSites);
router.get('/:id', protect, getSiteById);

// Admin only
router.post('/', protect, isAdmin, createSite);
router.put('/:id', protect, isAdmin, updateSite);
router.delete('/:id', protect, isAdmin, deleteSite);

module.exports = router;