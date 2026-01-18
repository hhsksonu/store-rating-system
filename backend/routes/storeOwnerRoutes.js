const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require store_owner role
router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', getDashboard);

module.exports = router;