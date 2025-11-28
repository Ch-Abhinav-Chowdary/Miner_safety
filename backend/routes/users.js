import express from 'express';
import { getAllUsers, updateUserShift } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// List all workers and supervisors
router.get('/', protect, authorize('admin'), getAllUsers);

// Update shift location/date for a specific user
router.put('/:id/shift', protect, authorize('admin'), updateUserShift);

export default router;
