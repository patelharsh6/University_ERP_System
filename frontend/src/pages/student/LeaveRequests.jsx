// src/pages/student/LeaveRequests.jsx
import React, { useState } from 'react';
import './LeaveRequests.css';
import { FiCalendar, FiPlus, FiCheckCircle, FiXCircle, FiClock, FiFileText, FiInbox } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { useMutation } from '../../hooks/useMutation';
import { useToast } from '../../context/ToastContext';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const LeaveRequests = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'Casual Leave',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const toast = useToast();

  const { 
    data: leavesData, 
    loading: loadingLeaves, 
    error: errorLeaves, 
    refetch: refetchLeaves 
  } = useApi(endpoints.students.leaves, { params: { page_size: 100 } });

  const { mutate: createLeave, submitting } = useMutation(endpoints.students.leaves, {
    method: 'POST',
  });

  const rawLeaves = Array.isArray(leavesData) 
    ? leavesData 
    : (leavesData?.results || []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <FiCheckCircle />;
      case 'rejected': return <FiXCircle />;
      case 'pending': return <FiClock />;
      default: return <FiClock />;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date || !formData.reason.trim()) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast.warning('End date cannot be earlier than start date.');
      return;
    }

    try {
      await createLeave(formData);
      toast.success('Leave Request Submitted Successfully!');
      setFormData({
        leave_type: 'Casual Leave',
        start_date: '',
        end_date: '',
        reason: '',
      });
      setShowForm(false);
      refetchLeaves();
    } catch (err) {
      toast.error(err.message || 'Failed to submit leave request.');
    }
  };

  return (
    <div className="leave-container">
      
      <div className="leave-header">
        <div>
          <h1><FiCalendar style={{ color: 'var(--leave-accent)' }} /> Leave Requests</h1>
          <p>Apply for absence and track your leave request statuses.</p>
        </div>
        <button className="btn-apply" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={18} /> {showForm ? 'Close Form' : 'New Request'}
        </button>
      </div>

      {/* NEW REQUEST FORM */}
      <div className={`leave-form-card ${showForm ? 'open' : ''}`}>
        <form onSubmit={handleApply}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Leave Type</label>
              <select 
                name="leave_type"
                className="form-select" 
                value={formData.leave_type}
                onChange={handleChange}
                required
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="On Duty (Event/Sports)">On Duty (Event/Sports)</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>From Date</label>
              <input 
                type="date" 
                name="start_date"
                className="form-input" 
                value={formData.start_date}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>To Date</label>
              <input 
                type="date" 
                name="end_date"
                className="form-input" 
                value={formData.end_date}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group full-width">
              <label>Reason</label>
              <textarea 
                name="reason"
                className="form-textarea" 
                placeholder="Detailed reason for leave..." 
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-apply" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      {/* LEAVE HISTORY */}
      <div className="leave-history">
        <h2>Past Requests</h2>
        {loadingLeaves ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton height="90px" borderRadius="12px" />
            <Skeleton height="90px" borderRadius="12px" />
            <Skeleton height="90px" borderRadius="12px" />
          </div>
        ) : errorLeaves ? (
          <ErrorState 
            message="Failed to load leave history. Please try again." 
            onRetry={refetchLeaves} 
          />
        ) : rawLeaves.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', background: 'var(--leave-card-bg)', border: '1px dashed var(--leave-card-border)', borderRadius: '12px', color: 'var(--leave-text-muted)' }}>
            <FiInbox style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: 'var(--leave-text-primary)' }}>No leave requests found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>You haven't submitted any leave requests yet.</p>
          </div>
        ) : (
          <div className="leave-list">
            {rawLeaves.map(leave => {
              const statusClass = (leave.status || 'pending').toLowerCase();
              return (
                <div key={leave.id} className="leave-card">
                  <div className="leave-info">
                    <div className="leave-type">{leave.leave_type || 'General Leave'}</div>
                    <div className="leave-dates">
                      <FiCalendar /> {leave.start_date ? formatDate(leave.start_date) : 'N/A'} - {leave.end_date ? formatDate(leave.end_date) : 'N/A'}
                    </div>
                    <div className="leave-reason">
                      <FiFileText style={{ marginRight: '6px' }} /> {leave.reason}
                    </div>
                  </div>

                  <div className={`leave-status status-${statusClass}`}>
                    {getStatusIcon(leave.status)} {leave.status || 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default LeaveRequests;

