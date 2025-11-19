import express from 'express';
import { protect as auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mock incident data (in a real app, this would come from a database)
const incidents = [
  {
    id: '1',
    title: 'Equipment Malfunction',
    description: 'Conveyor belt failure in Section A caused minor delays',
    date: '2023-10-15',
    severity: 'Medium',
    status: 'Resolved',
    location: 'Section A, Level 2',
    reportedBy: 'John Doe'
  },
  {
    id: '2',
    title: 'Minor Flooding',
    description: 'Water leak from drainage system affected lower tunnel access',
    date: '2023-09-28',
    severity: 'High',
    status: 'Resolved',
    location: 'Lower Tunnel, Section C',
    reportedBy: 'Sarah Smith'
  }
];

// Get all incidents
router.get('/', auth, (req, res) => {
  res.json({
    success: true,
    data: incidents
  });
});

// Get incident by ID
router.get('/:id', auth, (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  
  if (!incident) {
    return res.status(404).json({
      success: false,
      message: 'Incident not found'
    });
  }
  
  res.json({
    success: true,
    data: incident
  });
});

// Report a new incident (supervisor/admin only)
router.post('/', auth, (req, res) => {
  // Check if user is supervisor or admin
  if (req.user.role !== 'supervisor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Supervisor or Admin only.'
    });
  }
  
  // In a real app, you would validate and save to database
  const newIncident = {
    id: (incidents.length + 1).toString(),
    ...req.body,
    reportedBy: req.user.name,
    date: new Date().toISOString().split('T')[0],
    status: 'Under Investigation'
  };
  
  // For demo purposes, just return success
  res.status(201).json({
    success: true,
    message: 'Incident reported successfully',
    data: newIncident
  });
});

// Update incident status (admin only)
router.patch('/:id/status', auth, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  
  const incident = incidents.find(i => i.id === req.params.id);
  
  if (!incident) {
    return res.status(404).json({
      success: false,
      message: 'Incident not found'
    });
  }
  
  // In a real app, you would update the database
  // For demo purposes, just return success
  res.json({
    success: true,
    message: 'Incident status updated successfully',
    data: {
      ...incident,
      status: req.body.status
    }
  });
});

export default router;