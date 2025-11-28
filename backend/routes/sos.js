import express from 'express';
import {
  triggerSOS,
  getSOSAlerts,
  acknowledgeSOSAlert,
  resolveSOSAlert,
} from '../controllers/sosController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Trigger SOS alert (workers and supervisors can trigger)
router.post('/trigger', authorize('worker', 'supervisor'), triggerSOS);

// Get SOS alerts (admin only)
router.get('/alerts', authorize('admin'), getSOSAlerts);

// Acknowledge SOS alert (admin only)
router.patch('/alerts/:id/acknowledge', authorize('admin'), acknowledgeSOSAlert);

// Resolve SOS alert (admin only)
router.patch('/alerts/:id/resolve', authorize('admin'), resolveSOSAlert);

export default router;

