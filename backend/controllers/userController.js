import User from '../models/User.js';

// @desc    Get all workers and supervisors
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['worker', 'supervisor'] }
    }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a user shift location and date
// @route   PUT /api/users/:id/shift
// @access  Private/Admin
export const updateUserShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { shiftLocation, shiftDate } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow assigning shifts to workers and supervisors
    if (!['worker', 'supervisor'].includes(user.role)) {
      return res.status(400).json({ message: 'Shift can only be assigned to workers and supervisors' });
    }

    if (typeof shiftLocation === 'string') {
      user.shiftLocation = shiftLocation.trim();
    }

    if (shiftDate) {
      const date = new Date(shiftDate);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid shift date' });
      }
      user.shiftDate = date;
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: 'Shift assignment updated successfully',
      user: safeUser,
    });
  } catch (error) {
    console.error('Error updating user shift:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
