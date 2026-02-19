const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register new user
exports.register = async (req, res) => {
    try {
        const { email, password, fullName, role, track, batch, companyName, jobPosition, companyWebsite } = req.body;

        // Create user
        const user = await User.create({
            email,
            password,
            fullName,
            role: role || 'student',
            track,
            batch,
            companyName,
            jobPosition,
            companyWebsite
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                track: user.track,
                batch: user.batch,
                companyName: user.company_name,
                jobPosition: user.job_position,
                companyWebsite: user.company_website
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.message === 'Email already exists') {
            return res.status(409).json({ error: 'Email already registered' });
        }

        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check account status
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Account is not active' });
        }

        // Update last login
        await User.updateLastLogin(user.id);

        // Generate token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                track: user.track,
                batch: user.batch,
                companyName: user.company_name,
                jobPosition: user.job_position,
                companyWebsite: user.company_website
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Get current user info
exports.getMe = async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                fullName: req.user.full_name,
                role: req.user.role,
                track: req.user.track,
                batch: req.user.batch,
                status: req.user.status,
                createdAt: req.user.created_at,
                lastLogin: req.user.last_login
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user information' });
    }
};

// Logout (client-side token removal, optional server-side session cleanup)
exports.logout = async (req, res) => {
    try {
        // In a production app, you might want to blacklist the token here
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};
