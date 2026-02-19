const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { updateProfileValidation, updatePasswordValidation, validate } = require('../utils/validation');

// All user routes require authentication
router.use(authenticateToken);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validate, userController.updateProfile);
router.put('/password', updatePasswordValidation, validate, userController.updatePassword);

module.exports = router;
