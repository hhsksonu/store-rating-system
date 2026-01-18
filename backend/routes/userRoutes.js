const express = require('express');
const router = express.Router();
const { getStores, submitRating, updateRating } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require user role
router.use(authenticate, authorize('user'));

router.get('/stores', getStores);
router.post('/ratings', submitRating);
router.put('/ratings', updateRating);

module.exports = router;