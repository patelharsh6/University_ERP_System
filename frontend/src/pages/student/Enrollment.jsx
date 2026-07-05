// src/pages/student/Enrollment.jsx
import React, { useState } from 'react';
import './Enrollment.css';
import { FiUserCheck, FiBookOpen, FiAward, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const enrollmentData = {
  studentName: 'Harsh Patel',
  enrollmentNo: 'AU23BCE0001',
  program: 'B.Tech - Computer Engineering',
  currentSemester: 'Semester VI',
  status: 'Active',
  totalRequiredCredits: 160,
  earnedCredits: 104,
  currentEnrolledCredits: 22,
};

const currentSubjects = [
  { code: 'CE601', name: 'Database Management Systems', credits: 4, type: 'Core' },
  { code: 'CE602', name: 'Artificial Intelligence', credits: 4, type: 'Core' },
  { code: 'CE603', name: 'Computer Networks', credits: 4, type: 'Core' },
  { code: 'CE604', name: 'Software Engineering', credits: 4, type: 'Core' },
  { code: 'CE605', name: 'Web Technologies', credits: 3, type: 'Elective' },
  { code: 'CE606', name: 'Internet of Things', credits: 3, type: 'Elective' },
];

const completedSubjects = [
  { sem: 'Semester V', code: 'CE501', name: 'Operating Systems', grade: 'A+' },
  { sem: 'Semester V', code: 'CE502', name: 'Design and Analysis of Algorithms', grade: 'A' },
  { sem: 'Semester IV', code: 'CE401', name: 'Computer Organization', grade: 'A' },
  { sem: 'Semester IV', code: 'CE402', name: 'Java Programming', grade: 'A+' },
];

const Enrollment = () => {
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'completed'

  const progressPercentage = Math.round((enrollmentData.earnedCredits / enrollmentData.totalRequiredCredits) * 100);

  return (
    <div className="enrollment-page">
      {/* ── HEADER ── */}
      <div className="enrollment-header">
        <div className="enrollment-title-group">
          <div className="enrollment-icon"><FiUserCheck size={24} /></div>
          <div>
            <h1 className="enrollment-title">Course Enrollment</h1>
            <p className="enrollment-subtitle">Track your enrolled courses and degree progress</p>
          </div>
        </div>
        <div className="enrollment-status">
          Status: <span className="status-badge"><FiCheckCircle size={14} /> {enrollmentData.status}</span>
        </div>
      </div>

      {/* ── PROFILE & PROGRESS STRIP ── */}
      <div className="enrollment-summary">
        <div className="summary-left">
          <h2>{enrollmentData.studentName}</h2>
          <p>{enrollmentData.enrollmentNo} • {enrollmentData.program}</p>
          <div className="sem-tag">{enrollmentData.currentSemester}</div>
        </div>
        <div className="summary-right">
          <div className="progress-label">
            <span>Degree Progress</span>
            <strong>{progressPercentage}%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="credit-stats">
            <div>
              <strong>{enrollmentData.earnedCredits}</strong> Earned
            </div>
            <div>
              <strong>{enrollmentData.currentEnrolledCredits}</strong> Enrolled
            </div>
            <div>
              <strong>{enrollmentData.totalRequiredCredits}</strong> Required
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="enroll-tabs">
        <button 
          className={`enroll-tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Currently Enrolled
        </button>
        <button 
          className={`enroll-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Courses
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="enroll-content">
        {activeTab === 'current' && (
          <div className="subjects-grid">
            {currentSubjects.map((sub, i) => (
              <div key={i} className="subject-card">
                <div className="sub-top">
                  <span className={`sub-type ${sub.type.toLowerCase()}`}>{sub.type}</span>
                  <span className="sub-credits"><FiAward size={14}/> {sub.credits} Credits</span>
                </div>
                <h3 className="sub-code">{sub.code}</h3>
                <p className="sub-name">{sub.name}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="completed-table-wrap">
            <table className="completed-table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {completedSubjects.map((sub, i) => (
                  <tr key={i}>
                    <td><span className="sem-badge">{sub.sem}</span></td>
                    <td><strong>{sub.code}</strong></td>
                    <td>{sub.name}</td>
                    <td><span className="grade-pill">{sub.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="info-box">
              <FiAlertCircle size={16} />
              <p>For a full breakdown of your grades and SGPA/CGPA calculations, please visit the <strong>Reports</strong> page.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Enrollment;
