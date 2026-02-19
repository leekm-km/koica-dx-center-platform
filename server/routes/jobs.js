const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', jobController.getAll);
router.get('/:id', jobController.getById);

// Protected routes (require authentication)
router.post('/', authenticateToken, jobController.create);
router.get('/me/all', authenticateToken, jobController.getMine);
router.put('/:id', authenticateToken, jobController.update);
router.delete('/:id', authenticateToken, jobController.delete);

module.exports = router;
