// src/pages/student/Clearance.jsx
import React, { useState } from 'react';
import './Clearance.css';
import { FiCheckCircle, FiAlertTriangle, FiDownload, FiInfo, FiFileText } from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const clearanceStatus = {
  overallStatus: 'Pending', // 'Pending' | 'Cleared'
  studentName: 'Harsh Patel',
  enrollmentNo: 'AU23BCE0001',
  lastUpdated: '15 Feb 2026',
};

const departments = [
  { id: 1, name: 'Library', status: 'Cleared', remarks: 'No books due.', icon: '📚' },
  { id: 2, name: 'Accounts / Fees', status: 'Cleared', remarks: 'All semester fees paid.', icon: '💳' },
  { id: 3, name: 'Hostel', status: 'Pending', remarks: 'Pending room handover signature.', icon: '🏢' },
  { id: 4, name: 'Sports', status: 'Cleared', remarks: 'No equipment due.', icon: '⚽' },
  { id: 5, name: 'Laboratories', status: 'Pending', remarks: 'Pending breakage fee in Physics Lab.', icon: '🔬' },
];

const Clearance = () => {
  const [depts] = useState(departments);

  const isFullyCleared = depts.every(d => d.status === 'Cleared');

  return (
    <div className="clearance-page">
      {/* ── HEADER ── */}
      <div className="clearance-header">
        <div className="clearance-title-group">
          <div className="clearance-icon"><FiCheckCircle size={24} /></div>
          <div>
            <h1 className="clearance-title">No Dues & Clearance</h1>
            <p className="clearance-subtitle">Track your department-wise clearance status</p>
          </div>
        </div>
      </div>

      {/* ── STATUS CARD ── */}
      <div className={`overall-status-card ${isFullyCleared ? 'cleared' : 'pending'}`}>
        <div className="status-card-left">
          <h2>{clearanceStatus.studentName}</h2>
          <p>{clearanceStatus.enrollmentNo}</p>
        </div>
        <div className="status-card-right">
          <span className="status-label">Overall Status</span>
          <div className="status-value">
            {isFullyCleared ? (
              <><FiCheckCircle size={20} /> Fully Cleared</>
            ) : (
              <><FiAlertTriangle size={20} /> Pending Clearance</>
            )}
          </div>
          <span className="status-date">Updated: {clearanceStatus.lastUpdated}</span>
        </div>
      </div>

      {/* ── DEPARTMENTS LIST ── */}
      <div className="departments-list">
        <h3>Department Approvals</h3>
        <div className="dept-grid">
          {depts.map(dept => (
            <div key={dept.id} className={`dept-card ${dept.status.toLowerCase()}`}>
              <div className="dept-card-top">
                <span className="dept-icon">{dept.icon}</span>
                <span className={`dept-badge ${dept.status.toLowerCase()}`}>
                  {dept.status === 'Cleared' ? <FiCheckCircle /> : <FiAlertTriangle />}
                  {dept.status}
                </span>
              </div>
              <h4 className="dept-name">{dept.name}</h4>
              <p className="dept-remarks">
                {dept.status === 'Cleared' ? '✅ ' : '⚠️ '}{dept.remarks}
              </p>
              {dept.status === 'Pending' && (
                <button className="dept-action-btn">Request Clearance</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CERTIFICATE DOWNLOAD ── */}
      <div className="clearance-footer-card">
        <div className="footer-card-info">
          <FiFileText size={24} />
          <div>
            <h4>Clearance Certificate</h4>
            <p>Generate your official No Dues certificate once all departments are cleared.</p>
          </div>
        </div>
        <button 
          className="download-cert-btn" 
          disabled={!isFullyCleared}
          title={!isFullyCleared ? "Clear all departments first" : ""}
        >
          <FiDownload /> Generate Certificate
        </button>
      </div>

      {/* ── INSTRUCTIONS ── */}
      <div className="clearance-instructions">
        <FiInfo size={16} />
        <div>
          <strong>Note:</strong> If a department is marked as Pending, please contact the respective HOD or staff in-charge to resolve the dues. The final No Dues certificate is required for obtaining your final degree transcript.
        </div>
      </div>
    </div>
  );
};

export default Clearance;
