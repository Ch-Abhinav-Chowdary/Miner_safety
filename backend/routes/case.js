import express from 'express';
import {
  createCaseStudy,
  updateCaseStudy,
  listCaseStudies,
  getCaseStudy,
  approveCaseStudy,
  logCaseEngagement,
} from '../controllers/caseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, listCaseStudies)
  .post(
    protect,
    authorize('supervisor', 'admin', 'dgms_officer'),
    createCaseStudy,
  );

router
  .route('/:id')
  .get(protect, getCaseStudy)
  .patch(
    protect,
    authorize('supervisor', 'admin', 'dgms_officer'),
    updateCaseStudy,
  );

router.post(
  '/:id/approve',
  protect,
  authorize('supervisor', 'admin', 'dgms_officer'),
  approveCaseStudy,
);

router.post('/:id/engagement', protect, logCaseEngagement);

export default router;

