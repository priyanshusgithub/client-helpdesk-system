const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes are protected and admin only
router.use(protect, isAdmin);

router.get('/', getAllUsers);
router.get('/role/:role', getUsersByRole);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;