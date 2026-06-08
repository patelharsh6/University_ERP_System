// src/pages/student/LeaveRequests.jsx
import React, { useState } from 'react';
import './LeaveRequests.css';
import { FiCalendar, FiPlus, FiCheckCircle, FiXCircle, FiClock, FiFileText } from 'react-icons/fi';

const LeaveRequests = () => {
  const [showForm, setShowForm] = useState(false);

  const [mockLeaves, setMockLeaves] = useState([
    {
      id: 1,
      type: 'Medical Leave',
      fromDate: '12 May 2026',
      toDate: '14 May 2026',
      reason: 'Viral fever, resting at home. Medical certificate attached.',
      status: 'approved'
    },
    {
      id: 2,
      type: 'Casual Leave',
      fromDate: '05 Apr 2026',
      toDate: '05 Apr 2026',
      reason: 'Family function in hometown.',
      status: 'rejected'
    },
    {
      id: 3,
      type: 'On Duty (Event)',
      fromDate: '20 Jun 2026',
      toDate: '21 Jun 2026',
      reason: 'Participating in National Hackathon representing university.',
      status: 'pending'
    }
  ]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FiCheckCircle />;
      case 'rejected': return <FiXCircle />;
      case 'pending': return <FiClock />;
      default: return null;
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    alert("Leave Request Submitted Successfully!");
    setShowForm(false);
  };

  return (
    <div className="leave-container">
      
      <div className="leave-header">
        <div>
          <h1><FiCalendar style={{ color: 'var(--leave-accent)' }} /> Leave Requests</h1>
          <p>Apply for absence and track your leave request statuses.</p>
        </div>
        <button className="btn-apply" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={18} /> New Request
        </button>
      </div>

      {/* NEW REQUEST FORM */}
      <div className={`leave-form-card ${showForm ? 'open' : ''}`}>
        <form onSubmit={handleApply}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Leave Type</label>
              <select className="form-select" required>
                <option value="">Select leave type...</option>
                <option value="Casual">Casual Leave</option>
                <option value="Medical">Medical Leave</option>
                <option value="OnDuty">On Duty (Event/Sports)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>From Date</label>
              <input type="date" className="form-input" required />
            </div>

            <div className="form-group">
              <label>To Date</label>
              <input type="date" className="form-input" required />
            </div>

            <div className="form-group full-width">
              <label>Reason</label>
              <textarea className="form-textarea" placeholder="Detailed reason for leave..." required></textarea>
            </div>

            <div className="form-group full-width">
              <label>Supporting Document (Optional)</label>
              <input type="file" className="form-input" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-apply">Submit Request</button>
          </div>
        </form>
      </div>

      {/* LEAVE HISTORY */}
      <div className="leave-history">
        <h2>Past Requests</h2>
        <div className="leave-list">
          {mockLeaves.map(leave => (
            <div key={leave.id} className="leave-card">
              <div className="leave-info">
                <div className="leave-type">{leave.type}</div>
                <div className="leave-dates">
                  <FiCalendar /> {leave.fromDate} - {leave.toDate}
                </div>
                <div className="leave-reason">
                  <FiFileText style={{ marginRight: '6px' }}/> {leave.reason}
                </div>
              </div>

              <div className={`leave-status status-${leave.status}`}>
                {getStatusIcon(leave.status)} {leave.status}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LeaveRequests;
