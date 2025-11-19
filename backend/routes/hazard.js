import express from 'express';
import { protect as auth } from '../middleware/authMiddleware.js';
import { 
  getHazards, 
  getHazardById, 
  createHazard, 
  updateHazard, 
  resolveHazard, 
  deleteHazard,
  getHazardsBySeverity,
  getHazardsByCategory
} from '../controllers/hazardController.js';

const router = express.Router();

// Get all hazards
router.get('/', auth, getHazards);

// Get hazards by severity
router.get('/severity/:severity', auth, getHazardsBySeverity);

// Get hazards by category
router.get('/category/:category', auth, getHazardsByCategory);

// Create new hazard
router.post('/', auth, createHazard);

// Get hazard by ID
router.get('/:id', auth, getHazardById);

// Update hazard
router.put('/:id', auth, updateHazard);

// Resolve hazard
router.put('/:id/resolve', auth, resolveHazard);

// Delete hazard
router.delete('/:id', auth, deleteHazard);

export default router;