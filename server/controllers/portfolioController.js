const Portfolio = require('../models/Portfolio');

// Create a new portfolio
exports.create = async (req, res) => {
    try {
        const {
            name,
            track,
            batch,
            major,
            skills,
            projectTitle,
            projectDescription,
            githubUrl,
            demoUrl,
            imageUrl
        } = req.body;

        const portfolio = await Portfolio.create({
            userId: req.user.id,
            name: name || req.user.full_name,
            track,
            batch,
            major,
            skills,
            projectTitle,
            projectDescription,
            githubUrl,
            demoUrl,
            imageUrl
        });

        res.status(201).json({
            message: 'Portfolio created successfully',
            portfolio
        });
    } catch (error) {
        console.error('Create portfolio error:', error);
        res.status(500).json({ error: 'Failed to create portfolio' });
    }
};

// Get all portfolios (with optional filters)
exports.getAll = async (req, res) => {
    try {
        const { track, limit } = req.query;

        const portfolios = await Portfolio.findAll({
            track: track ? parseInt(track) : undefined,
            limit: limit ? parseInt(limit) : undefined
        });

        res.json({ portfolios });
    } catch (error) {
        console.error('Get portfolios error:', error);
        res.status(500).json({ error: 'Failed to get portfolios' });
    }
};

// Get a single portfolio by ID
exports.getById = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        res.json({ portfolio });
    } catch (error) {
        console.error('Get portfolio error:', error);
        res.status(500).json({ error: 'Failed to get portfolio' });
    }
};

// Get current user's portfolios
exports.getMine = async (req, res) => {
    try {
        const portfolios = await Portfolio.findByUserId(req.user.id);
        res.json({ portfolios });
    } catch (error) {
        console.error('Get my portfolios error:', error);
        res.status(500).json({ error: 'Failed to get your portfolios' });
    }
};

// Update a portfolio
exports.update = async (req, res) => {
    try {
        const portfolioId = req.params.id;

        // Check if portfolio exists and belongs to user
        const existing = await Portfolio.findById(portfolioId);
        if (!existing) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        if (existing.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own portfolios' });
        }

        const portfolio = await Portfolio.update(portfolioId, req.user.id, req.body);

        res.json({
            message: 'Portfolio updated successfully',
            portfolio
        });
    } catch (error) {
        console.error('Update portfolio error:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
};

// Delete a portfolio
exports.delete = async (req, res) => {
    try {
        const portfolioId = req.params.id;

        // Check if portfolio exists and belongs to user
        const existing = await Portfolio.findById(portfolioId);
        if (!existing) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only delete your own portfolios' });
        }

        const deleted = await Portfolio.delete(portfolioId, req.user.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Portfolio not found or already deleted' });
        }

        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error('Delete portfolio error:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
};
