// File: backend/src/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  bulkDeleteFeedback,
  bulkUpdateFeedback,
  getFeedbackStats
} = require('../controllers/feedbackController');

// Stats route (must be before /:id)
router.get('/stats', getFeedbackStats);

// Bulk operations
router.post('/bulk-delete', bulkDeleteFeedback);
router.post('/bulk-update', bulkUpdateFeedback);

router.route('/')
  .post(createFeedback)
  .get(getAllFeedback);

router.route('/:id')
  .get(getFeedbackById)
  .put(updateFeedback)
  .delete(deleteFeedback);

module.exports = router;
