const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getUsers,
    getStores,
    addUser,
    addStore
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/stores', getStores);
router.post('/users', addUser);
router.post('/stores', addStore);

module.exports = router;