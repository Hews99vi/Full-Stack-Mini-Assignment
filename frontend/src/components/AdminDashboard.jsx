// File: frontend/src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  getAllFeedback, 
  getFeedbackStats, 
  updateFeedback, 
  deleteFeedback,
  bulkDeleteFeedback,
  bulkUpdateFeedback 
} from '../services/api';

const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
  'Operations'
];

const AdminDashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchFeedback = async (department = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllFeedback(department);
      setFeedback(data);
      setFilteredFeedback(data);
    } catch (err) {
      setError('Failed to load feedback. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getFeedbackStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchFeedback(selectedDepartment);
    fetchStats();
  }, [selectedDepartment]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, feedback, sortBy, dateRange]);

  const applyFilters = () => {
    let filtered = [...feedback];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => 
        new Date(item.createdAt) <= endDate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredFeedback(filtered);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedItems([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredFeedback.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    setConfirmAction({
      title: 'Delete Feedback',
      message: 'Are you sure you want to delete this feedback?',
      onConfirm: async () => {
        try {
          await deleteFeedback(id);
          fetchFeedback(selectedDepartment);
          fetchStats();
          setShowConfirmModal(false);
        } catch (err) {
          alert('Failed to delete feedback');
          setShowConfirmModal(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    setConfirmAction({
      title: 'Delete Multiple Feedback',
      message: `Are you sure you want to delete ${selectedItems.length} selected feedback ${selectedItems.length === 1 ? 'item' : 'items'}?`,
      onConfirm: async () => {
        try {
          await bulkDeleteFeedback(selectedItems);
          setSelectedItems([]);
          fetchFeedback(selectedDepartment);
          fetchStats();
          setShowConfirmModal(false);
        } catch (err) {
          alert('Failed to delete feedback');
          setShowConfirmModal(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateFeedback(id, { status });
      fetchFeedback(selectedDepartment);
      fetchStats();
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedItems.length === 0) return;

    try {
      await bulkUpdateFeedback(selectedItems, { status });
      setSelectedItems([]);
      fetchFeedback(selectedDepartment);
      fetchStats();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    try {
      await updateFeedback(id, { isRead });
      fetchFeedback(selectedDepartment);
    } catch (err) {
      console.error('Mark as read error:', err);
      alert('Failed to update read status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleViewDetails = (item) => {
    setSelectedFeedback(item);
    setShowModal(true);
    if (!item.isRead) {
      handleMarkAsRead(item._id, true);
    }
  };

  const handleSaveNotes = async (notes) => {
    try {
      await updateFeedback(selectedFeedback._id, { notes });
      setShowModal(false);
      fetchFeedback(selectedDepartment);
    } catch (err) {
      console.error('Save notes error:', err);
      alert('Failed to save notes: ' + (err.response?.data?.error || err.message));
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Department', 'Message', 'Status', 'Date', 'Notes'];
    const rows = filteredFeedback.map(item => [
      item.name,
      item.department,
      item.message,
      item.status || 'pending',
      formatDate(item.createdAt),
      item.notes || ''
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="container admin-container">
      {/* Statistics Dashboard */}
      {stats && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalCount}</div>
              <div className="stat-label">Total Feedback</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <div className="stat-value">{stats.avgPerDay}</div>
              <div className="stat-label">Avg Per Day</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">
                {stats.byStatus.find(s => s._id === 'pending')?.count || 0}
              </div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">
                {stats.byStatus.find(s => s._id === 'resolved')?.count || 0}
              </div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>
      )}

      <h1>Admin Dashboard</h1>
      <p className="subtitle">View and manage employee feedback</p>

      {/* Filters Section */}
      <div className="filters-wrapper">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="department-filter">Department:</label>
            <select
              id="department-filter"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="date-start">From:</label>
            <input
              id="date-start"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="date-end">To:</label>
            <input
              id="date-end"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="date-input"
            />
          </div>

          <button 
            onClick={() => {
              setDateRange({ start: '', end: '' });
              setSearchQuery('');
              setSelectedDepartment('');
            }} 
            className="btn-clear"
          >
            Clear Filters
          </button>

          <button 
            onClick={() => fetchFeedback(selectedDepartment)} 
            className="btn-refresh"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>

          <button 
            onClick={exportToCSV} 
            className="btn-export"
            disabled={filteredFeedback.length === 0}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <span className="bulk-count">{selectedItems.length} selected</span>
          <button 
            onClick={() => handleBulkStatusUpdate('pending')} 
            className="bulk-btn bulk-pending"
          >
            Mark Pending
          </button>
          <button 
            onClick={() => handleBulkStatusUpdate('reviewed')} 
            className="bulk-btn bulk-reviewed"
          >
            Mark Reviewed
          </button>
          <button 
            onClick={() => handleBulkStatusUpdate('resolved')} 
            className="bulk-btn bulk-resolved"
          >
            Mark Resolved
          </button>
          <button 
            onClick={handleBulkDelete} 
            className="bulk-btn bulk-delete"
          >
            Delete Selected
          </button>
        </div>
      )}

      {loading && <div className="loading">Loading feedback...</div>}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && filteredFeedback.length === 0 && (
        <div className="empty-state">
          <p>📭 No feedback found</p>
          <p>
            {selectedDepartment || searchQuery || dateRange.start
              ? 'Try adjusting your filters.' 
              : 'No feedback submissions have been received yet.'}
          </p>
        </div>
      )}

      {!loading && !error && filteredFeedback.length > 0 && (
        <div className="table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === filteredFeedback.length}
                  />
                </th>
                <th>Status</th>
                <th>Name</th>
                <th>Department</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.map((item) => (
                <tr 
                  key={item._id} 
                  className={!item.isRead ? 'unread-row' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                  </td>
                  <td>
                    <select
                      value={item.status || 'pending'}
                      onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                      className="status-select"
                      style={{ borderColor: getStatusColor(item.status || 'pending') }}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="name-cell">
                    {item.name}
                    {!item.isRead && <span className="unread-badge">NEW</span>}
                  </td>
                  <td>
                    <span className={`badge badge-${item.department.toLowerCase()}`}>
                      {item.department}
                    </span>
                  </td>
                  <td className="message-cell">{item.message}</td>
                  <td className="date-cell">{formatDate(item.createdAt)}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setShowModal(false)}
          onSaveNotes={handleSaveNotes}
        />
      )}

      {/* Confirm Modal */}
      {showConfirmModal && confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

// Feedback Detail Modal Component
const FeedbackModal = ({ feedback, onClose, onSaveNotes }) => {
  const [notes, setNotes] = useState(feedback.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveNotes(notes);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feedback Details</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <label>Name:</label>
            <span>{feedback.name}</span>
          </div>
          <div className="detail-row">
            <label>Department:</label>
            <span className={`badge badge-${feedback.department.toLowerCase()}`}>
              {feedback.department}
            </span>
          </div>
          <div className="detail-row">
            <label>Status:</label>
            <span className="status-badge" style={{ 
              backgroundColor: feedback.status === 'resolved' ? '#10b981' : 
                             feedback.status === 'reviewed' ? '#3b82f6' : '#f59e0b'
            }}>
              {feedback.status || 'pending'}
            </span>
          </div>
          <div className="detail-row">
            <label>Date:</label>
            <span>{new Date(feedback.createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-section">
            <label>Message:</label>
            <p className="message-detail">{feedback.message}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="detail-section">
              <label htmlFor="notes">Admin Notes:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes or response here..."
                rows="5"
                className="notes-textarea"
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Notes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Confirm Modal Component
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <div className="confirm-icon">⚠️</div>
          <h2>{title}</h2>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-confirm-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
