const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', portfolioController.getAll);
router.get('/:id', portfolioController.getById);

// Protected routes (require authentication)
router.post('/', authenticateToken, portfolioController.create);
router.get('/me/all', authenticateToken, portfolioController.getMine);
router.put('/:id', authenticateToken, portfolioController.update);
router.delete('/:id', authenticateToken, portfolioController.delete);

module.exports = router;
