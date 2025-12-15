// File: frontend/src/components/FeedbackForm.jsx
import { useState } from 'react';
import { submitFeedback } from '../services/api';

const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
  'Operations'
];

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing again
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await submitFeedback(formData);
      setStatus({ type: 'success', message: 'Feedback submitted successfully!' });
      setFormData({ name: '', department: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="feedback-form-layout">
        <div className="form-section">
          <h1>Employee Feedback Form</h1>
          <p className="subtitle">Share your thoughts and help us improve</p>

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={80}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={6}
                placeholder="Share your feedback..."
              />
              <small>{formData.message.length}/1000 characters</small>
            </div>

            {status.message && (
              <div className={`alert alert-${status.type}`}>
                {status.message}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        <div className="illustration-section">
          <div className="feedback-illustration">
            <div className="floating-icon icon-1">💬</div>
            <div className="floating-icon icon-2">✨</div>
            <div className="floating-icon icon-3">📝</div>
            <div className="floating-icon icon-4">💡</div>
            <div className="floating-icon icon-5">⭐</div>
            <div className="central-graphic">
              <div className="pulse-circle"></div>
              <div className="pulse-circle pulse-delay-1"></div>
              <div className="pulse-circle pulse-delay-2"></div>
              <div className="main-icon">💼</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
