import express from 'express';
import { 
  getUserChecklist,
  completeChecklistItem
} from '../controllers/checklistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All checklist routes are protected
router.use(protect);

// Get user's checklist for today
router.get('/:userId', getUserChecklist);

// Complete a checklist item
router.patch('/complete', completeChecklistItem);

export default router;