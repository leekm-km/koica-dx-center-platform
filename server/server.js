require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the parent directory (frontend files)
app.use(express.static(path.join(__dirname, '..')));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const portfolioRoutes = require('./routes/portfolios');
const jobRoutes = require('./routes/jobs');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await db.connect();

        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
            console.log(`\n🌐 Frontend URLs:`);
            console.log(`   - http://localhost:${PORT}/index.html`);
            console.log(`   - http://localhost:${PORT}/lms.html (Login)`);
            console.log(`   - http://localhost:${PORT}/register.html`);
            console.log(`\n📊 API endpoints:`);
            console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
            console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
            console.log(`   - GET  http://localhost:${PORT}/api/auth/me`);
            console.log(`   - GET  http://localhost:${PORT}/api/users/profile`);
            console.log(`\n✨ Ready to accept requests!\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await db.close();
    process.exit(0);
});

startServer();
