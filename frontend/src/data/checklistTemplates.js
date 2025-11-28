// Fallback checklist templates for frontend use when backend is unavailable
// These match the backend templates to ensure consistency

export const checklistTemplates = {
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

/**
 * Get fallback checklist data for a user role
 * @param {string} role - User role (worker, supervisor, admin, dgms_officer)
 * @returns {Object} Checklist object with items
 */
export const getFallbackChecklist = (role = 'worker') => {
  const template = checklistTemplates[role] || checklistTemplates.worker;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    _id: 'fallback-checklist',
    user: null,
    role: role,
    date: today,
    items: template.map((item, index) => ({
      _id: `fallback-item-${index}`,
      task: item.task,
      category: item.category,
      completed: false,
      completedAt: null
    })),
    createdAt: today,
    updatedAt: today
  };
};

