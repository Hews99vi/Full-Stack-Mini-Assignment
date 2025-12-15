// File: backend/src/controllers/feedbackController.js
const Feedback = require('../models/Feedback');

// @desc    Create new feedback
// @route   POST /feedback
// @access  Public
exports.createFeedback = async (req, res, next) => {
  try {
    const { name, department, message } = req.body;

    // Validate required fields
    if (!name || !department || !message) {
      return res.status(400).json({ 
        error: 'Please provide name, department, and message' 
      });
    }

    const feedback = await Feedback.create({
      name,
      department,
      message
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback
// @route   GET /feedback
// @access  Public
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { department } = req.query;
    
    // Build filter query
    const filter = {};
    if (department) {
      filter.department = department;
    }

    const feedback = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback by ID
// @route   GET /feedback/:id
// @access  Public
exports.getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback
// @route   PUT /feedback/:id
// @access  Public
exports.updateFeedback = async (req, res, next) => {
  try {
    const { status, isRead, notes } = req.body;
    
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;
    if (notes !== undefined) updateData.notes = notes;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /feedback/:id
// @access  Public
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete feedback
// @route   POST /feedback/bulk-delete
// @access  Public
exports.bulkDeleteFeedback = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of feedback IDs' });
    }

    const result = await Feedback.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ 
      message: `${result.deletedCount} feedback entries deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update feedback
// @route   POST /feedback/bulk-update
// @access  Public
exports.bulkUpdateFeedback = async (req, res, next) => {
  try {
    const { ids, updateData } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of feedback IDs' });
    }

    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({ error: 'Please provide update data' });
    }

    const result = await Feedback.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    res.status(200).json({ 
      message: `${result.modifiedCount} feedback entries updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback statistics
// @route   GET /feedback/stats
// @access  Public
exports.getFeedbackStats = async (req, res, next) => {
  try {
    // Total count
    const totalCount = await Feedback.countDocuments();

    // Count by department
    const byDepartment = await Feedback.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Count by status
    const byStatus = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Feedback.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Average per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCount = await Feedback.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    const avgPerDay = (recentCount / 30).toFixed(2);

    res.status(200).json({
      totalCount,
      byDepartment,
      byStatus,
      recentActivity,
      avgPerDay
    });
  } catch (error) {
    next(error);
  }
};
