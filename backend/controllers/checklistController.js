import Checklist from '../models/Checklist.js';
import User from '../models/User.js';

// Expanded role-based safety checklist templates
const checklistTemplates = {
  worker: [
    { task: 'Put on hard hat, safety boots, and high-visibility vest', category: 'PPE' },
    { task: 'Wear safety glasses and gloves appropriate for task', category: 'PPE' },
    { task: 'Check personal gas detector is functioning', category: 'Equipment' },
    { task: 'Inspect tools and equipment for damage or defects', category: 'Equipment' },
    { task: 'Verify communication device (radio/phone) is working', category: 'Communication' },
    { task: 'Confirm ventilation system is operating in work area', category: 'Environment' },
    { task: 'Inspect immediate work area for hazards', category: 'Environment' },
    { task: 'Verify emergency exit routes are clear', category: 'Safety' },
    { task: 'Review assigned tasks and safety procedures', category: 'Procedures' },
    { task: 'Report any unsafe conditions to supervisor', category: 'Reporting' }
  ],
  supervisor: [
    { task: 'Conduct pre-shift safety briefing with team', category: 'Team Management' },
    { task: 'Verify all workers are wearing proper PPE', category: 'PPE Compliance' },
    { task: 'Review hazard reports from previous shift', category: 'Documentation' },
    { task: 'Inspect critical safety equipment (alarms, lights, signs)', category: 'Equipment' },
    { task: 'Check emergency evacuation routes and assembly points', category: 'Emergency Preparedness' },
    { task: 'Verify ventilation and gas monitoring systems', category: 'Environment' },
    { task: 'Inspect first aid kits and emergency supplies', category: 'Emergency Equipment' },
    { task: 'Review work permits for high-risk activities', category: 'Permits' },
    { task: 'Conduct spot checks on worker safety practices', category: 'Safety Audits' },
    { task: 'Document any safety concerns or near-misses', category: 'Reporting' },
    { task: 'Ensure adequate communication between all team members', category: 'Communication' },
    { task: 'Verify emergency response team availability', category: 'Emergency Preparedness' }
  ],
  admin: [
    { task: 'Review daily safety compliance reports', category: 'Compliance' },
    { task: 'Check emergency response system status and alerts', category: 'Systems' },
    { task: 'Verify safety training records are up to date', category: 'Training' },
    { task: 'Review incident and near-miss reports', category: 'Incidents' },
    { task: 'Update safety documentation and procedures as needed', category: 'Documentation' },
    { task: 'Monitor equipment maintenance schedules', category: 'Maintenance' },
    { task: 'Check safety equipment inventory levels', category: 'Inventory' },
    { task: 'Review and approve safety improvement suggestions', category: 'Improvements' },
    { task: 'Ensure communication systems are operational', category: 'Systems' },
    { task: 'Coordinate with DGMS officers on regulatory matters', category: 'Coordination' }
  ],
  dgms_officer: [
    { task: 'Review overall regulatory compliance status', category: 'Compliance' },
    { task: 'Check incident investigation reports and corrective actions', category: 'Investigations' },
    { task: 'Verify safety audit schedule and completion status', category: 'Audits' },
    { task: 'Review ventilation survey and gas monitoring data', category: 'Environment' },
    { task: 'Check ground control and roof support management', category: 'Geotechnical' },
    { task: 'Inspect mine plans and working drawings', category: 'Documentation' },
    { task: 'Review electrical safety inspections and certifications', category: 'Electrical' },
    { task: 'Verify explosive storage and handling compliance', category: 'Explosives' },
    { task: 'Check statutory registers and records', category: 'Records' },
    { task: 'Review emergency preparedness and rescue arrangements', category: 'Emergency' },
    { task: 'Assess safety training programs effectiveness', category: 'Training' },
    { task: 'Prepare regulatory reports and submissions', category: 'Reporting' }
  ]
};

// @desc    Get today's checklist for a user
// @route   GET /api/checklist/:userId
// @access  Private
export const getUserChecklist = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Role-based access control: Users can only access their own checklist
    // unless they are admin or dgms_officer
    if (req.user.id !== userId && 
        !['admin', 'dgms_officer'].includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. You can only view your own checklist.' 
      });
    }
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find user to get their role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find existing checklist for today
    let checklist = await Checklist.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    // If no checklist exists for today, create one with role-specific template
    if (!checklist) {
      // Get template based on user role - ensures role-specific checklist
      const template = checklistTemplates[user.role] || checklistTemplates.worker;
      
      checklist = await Checklist.create({
        user: userId,
        role: user.role,
        items: template,
        date: today
      });
    }
    
    res.json({
      success: true,
      data: checklist,
      userRole: user.role
    });
  } catch (error) {
    console.error('Error in getUserChecklist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching checklist' 
    });
  }
};

// @desc    Mark checklist item as completed/uncompleted
// @route   PATCH /api/checklist/complete
// @access  Private
export const completeChecklistItem = async (req, res) => {
  try {
    const { checklistId, itemId } = req.body;
    
    // Find the checklist
    const checklist = await Checklist.findById(checklistId).populate('user');
    
    if (!checklist) {
      return res.status(404).json({ 
        success: false,
        message: 'Checklist not found' 
      });
    }
    
    // Role-based access control: Users can only update their own checklist
    if (req.user.id !== checklist.user._id.toString() && 
        !['admin', 'dgms_officer'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only update your own checklist.' 
      });
    }
    
    // Find the specific item
    const item = checklist.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Checklist item not found' 
      });
    }
    
    // Toggle the completion status
    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date() : null;
    
    // Save the updated checklist
    await checklist.save();
    
    res.json({
      success: true,
      data: checklist,
      message: item.completed ? 'Task marked as completed' : 'Task marked as incomplete'
    });
  } catch (error) {
    console.error('Error in completeChecklistItem:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating checklist item' 
    });
  }
};

// @desc    Get compliance stats for supervisor dashboard
// @route   GET /api/checklist/stats
// @access  Private (Supervisor+)
export const getChecklistStats = async (req, res) => {
  try {
    // Get date range (default to last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    // Aggregate checklist completion data
    const stats = await Checklist.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            role: '$role'
          },
          totalItems: { $sum: 1 },
          completedItems: {
            $sum: { $cond: [{ $eq: ['$items.completed', true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          role: '$_id.role',
          totalItems: 1,
          completedItems: 1,
          complianceRate: {
            $multiply: [
              { $divide: ['$completedItems', '$totalItems'] },
              100
            ]
          }
        }
      },
      {
        $sort: { date: 1, role: 1 }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};