const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, track, batch } = req.body;

        const updatedUser = await User.updateProfile(req.user.id, {
            fullName: fullName || req.user.full_name,
            track: track !== undefined ? track : req.user.track,
            batch: batch !== undefined ? batch : req.user.batch
        });

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password hash
        const userWithPassword = await User.findByEmail(req.user.email);

        // Verify current password
        const isValidPassword = await User.verifyPassword(currentPassword, userWithPassword.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update password
        await User.updatePassword(req.user.id, newPassword);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};
