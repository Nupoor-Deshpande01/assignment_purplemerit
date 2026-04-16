const express = require('express');
const { body } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  softDeleteUser
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Add global authentication wall to user routes
router.use(verifyToken);

router.get('/', authorize('admin', 'manager'), getAllUsers);

router.get('/:id', authorize('admin', 'manager'), getUserById);

// Reusable validator check middleware wrapper
const checkValidation = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation Error', data: errors.array() });
  }
  next();
};

router.post(
  '/',
  authorize('admin'),
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password of at least 6 characters is required').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'manager', 'user']),
  ],
  checkValidation,
  createUser
);

router.put(
  '/:id',
  [
    body('email', 'Valid email is required').optional().isEmail(),
    body('password', 'Password of at least 6 characters is required').optional().isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'manager', 'user']),
  ],
  checkValidation,
  updateUser
);

router.delete('/:id', authorize('admin'), softDeleteUser);

module.exports = router;
