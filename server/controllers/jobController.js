const Job = require('../models/Job');

// Create a new job posting
exports.create = async (req, res) => {
    try {
        const {
            companyName,
            jobTitle,
            jobType,
            location,
            salaryRange,
            description,
            requiredSkills,
            applicationUrl,
            applicationEmail,
            deadline
        } = req.body;

        const job = await Job.create({
            userId: req.user.id,
            companyName,
            jobTitle,
            jobType,
            location,
            salaryRange,
            description,
            requiredSkills,
            applicationUrl,
            applicationEmail,
            deadline
        });

        res.status(201).json({
            message: 'Job posted successfully',
            job
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Failed to create job posting' });
    }
};

// Get all job postings (with optional filters)
exports.getAll = async (req, res) => {
    try {
        const { jobType, limit } = req.query;

        const jobs = await Job.findAll({
            jobType,
            limit: limit ? parseInt(limit) : undefined
        });

        res.json({ jobs });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Failed to get job postings' });
    }
};

// Get a single job by ID
exports.getById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({ job });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ error: 'Failed to get job posting' });
    }
};

// Get current user's job postings
exports.getMine = async (req, res) => {
    try {
        const jobs = await Job.findByUserId(req.user.id);
        res.json({ jobs });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({ error: 'Failed to get your job postings' });
    }
};

// Update a job posting
exports.update = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check if job exists and belongs to user
        const existing = await Job.findById(jobId);
        if (!existing) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (existing.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own job postings' });
        }

        const job = await Job.update(jobId, req.user.id, req.body);

        res.json({
            message: 'Job updated successfully',
            job
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({ error: 'Failed to update job posting' });
    }
};

// Delete a job posting
exports.delete = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check if job exists and belongs to user
        const existing = await Job.findById(jobId);
        if (!existing) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only delete your own job postings' });
        }

        const deleted = await Job.delete(jobId, req.user.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Job not found or already deleted' });
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ error: 'Failed to delete job posting' });
    }
};
