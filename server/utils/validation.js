const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage('Password must contain letters and numbers'),
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('role')
        .optional()
        .isIn(['student', 'instructor', 'admin', 'employer'])
        .withMessage('Invalid role'),
    body('track')
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage('Track must be 1, 2, or 3')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const updateProfileValidation = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('track')
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage('Track must be 1, 2, or 3'),
    body('batch')
        .optional()
        .trim()
];

const updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage('New password must contain letters and numbers')
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    updatePasswordValidation,
    validate
};
