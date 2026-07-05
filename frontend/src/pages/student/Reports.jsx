// src/pages/student/Reports.jsx
import React, { useState } from 'react';
import './Reports.css';
import { FiBarChart2, FiDownload, FiTrendingUp, FiCheckCircle, FiAward, FiBook } from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const academicSummary = {
  cgpa: 8.75,
  totalCredits: 124,
  earnedCredits: 104,
  currentSemester: 'Semester VI',
  overallAttendance: 88.5
};

const semesterReports = [
  {
    id: 1,
    semester: 'Semester V',
    term: 'Autumn 2025',
    sgpa: 8.92,
    credits: 22,
    status: 'Pass',
    courses: [
      { code: 'CE501', name: 'Operating Systems', grade: 'A+', credits: 4 },
      { code: 'CE502', name: 'Design and Analysis of Algorithms', grade: 'A', credits: 4 },
      { code: 'CE503', name: 'Theory of Computation', grade: 'B+', credits: 4 },
      { code: 'CE504', name: 'Machine Learning', grade: 'A', credits: 4 },
      { code: 'CE501P', name: 'OS Lab', grade: 'A+', credits: 2 },
      { code: 'CE502P', name: 'DAA Lab', grade: 'A', credits: 2 },
      { code: 'HS501', name: 'Professional Ethics', grade: 'A+', credits: 2 },
    ]
  },
  {
    id: 2,
    semester: 'Semester IV',
    term: 'Spring 2025',
    sgpa: 8.65,
    credits: 24,
    status: 'Pass',
    courses: [
      { code: 'CE401', name: 'Computer Organization', grade: 'A', credits: 4 },
      { code: 'CE402', name: 'Java Programming', grade: 'A+', credits: 4 },
      { code: 'CE403', name: 'Discrete Mathematics', grade: 'B+', credits: 4 },
      { code: 'CE404', name: 'System Software', grade: 'A', credits: 4 },
      { code: 'CE402P', name: 'Java Lab', grade: 'O', credits: 2 },
      { code: 'CE404P', name: 'System Software Lab', grade: 'A', credits: 2 },
      { code: 'HS401', name: 'Environmental Science', grade: 'A', credits: 4 },
    ]
  },
  {
    id: 3,
    semester: 'Semester III',
    term: 'Autumn 2024',
    sgpa: 8.80,
    credits: 22,
    status: 'Pass',
    courses: [] 
  },
];

const Reports = () => {
  const [selectedSem, setSelectedSem] = useState(semesterReports[0]);

  return (
    <div className="reports-page">
      {/* ── HEADER ── */}
      <div className="reports-header">
        <div className="reports-title-group">
          <div className="reports-icon"><FiBarChart2 size={24} /></div>
          <div>
            <h1 className="reports-title">Academic Reports</h1>
            <p className="reports-subtitle">Track your performance and view transcripts</p>
          </div>
        </div>
        <button className="reports-download-btn">
          <FiDownload size={14} /> Official Transcript
        </button>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="reports-kpi-grid">
        <div className="report-kpi-card">
          <div className="kpi-icon cgpa"><FiTrendingUp size={20} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Cumulative GPA</span>
            <span className="kpi-value">{academicSummary.cgpa}</span>
          </div>
        </div>
        <div className="report-kpi-card">
          <div className="kpi-icon credits"><FiAward size={20} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Earned Credits</span>
            <span className="kpi-value">{academicSummary.earnedCredits} <span className="kpi-total">/ {academicSummary.totalCredits}</span></span>
          </div>
        </div>
        <div className="report-kpi-card">
          <div className="kpi-icon attendance"><FiCheckCircle size={20} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Overall Attendance</span>
            <span className="kpi-value">{academicSummary.overallAttendance}%</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="reports-content">
        
        {/* Semester Selector */}
        <div className="semester-sidebar">
          <h3 className="sidebar-title">Semester Reports</h3>
          <div className="semester-list">
            {semesterReports.map(sem => (
              <button
                key={sem.id}
                className={`semester-item ${selectedSem.id === sem.id ? 'active' : ''}`}
                onClick={() => setSelectedSem(sem)}
              >
                <div className="sem-item-top">
                  <span className="sem-name">{sem.semester}</span>
                  <span className="sem-sgpa">SGPA: {sem.sgpa}</span>
                </div>
                <div className="sem-term">{sem.term}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Semester Details */}
        <div className="semester-details">
          <div className="sem-details-header">
            <div>
              <h2>{selectedSem.semester} Results</h2>
              <p>{selectedSem.term}</p>
            </div>
            <div className="sem-summary-tags">
              <span className="tag sgpa">SGPA: {selectedSem.sgpa}</span>
              <span className="tag credits">Credits: {selectedSem.credits}</span>
              <span className="tag status">{selectedSem.status}</span>
            </div>
          </div>

          {selectedSem.courses.length > 0 ? (
            <div className="sem-table-wrap">
              <table className="sem-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSem.courses.map((course, i) => (
                    <tr key={i}>
                      <td><span className="course-code-badge">{course.code}</span></td>
                      <td className="course-name"><FiBook size={12}/> {course.name}</td>
                      <td>{course.credits}</td>
                      <td><span className={`grade-badge grade-${course.grade.replace('+','-plus')}`}>{course.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-courses">
              <FiBarChart2 size={40} />
              <p>Detailed course breakdown not available for this semester.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;