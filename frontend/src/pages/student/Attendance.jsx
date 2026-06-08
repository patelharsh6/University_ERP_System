// src/pages/student/Attendance.jsx
import React, { useState } from 'react';
import './Attendance.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { FaInfoCircle, FaCalendarAlt, FaCheck, FaTimes, FaUserCheck, FaUserTimes, FaExchangeAlt } from 'react-icons/fa';

const initialRoster = [
  { id: 1, roll: "AU210001", name: "Harsh Patel", prevPct: 92, status: "Present" },
  { id: 2, roll: "AU210002", name: "Aditya Sharma", prevPct: 82, status: "Present" },
  { id: 3, roll: "AU210003", name: "Pooja Mehta", prevPct: 71, status: "Present" },
  { id: 4, roll: "AU210004", name: "Rahul Verma", prevPct: 58, status: "Absent" },
  { id: 5, roll: "AU210005", name: "Sneha Reddy", prevPct: 96, status: "Present" },
  { id: 6, roll: "AU210006", name: "Amit Gupta", prevPct: 88, status: "Present" },
  { id: 7, roll: "AU210007", name: "Vikram Rathore", prevPct: 76, status: "Present" },
  { id: 8, roll: "AU210008", name: "Neha Joshi", prevPct: 91, status: "Present" },
  { id: 9, roll: "AU210009", name: "Karan Johar", prevPct: 45, status: "Absent" },
  { id: 10, roll: "AU210010", name: "Deepika Padukone", prevPct: 94, status: "Present" },
];

// Mock Heatmap values representing 30 days
const mockHeatmapData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  // Random attendance percentages for each day
  let rate = 95;
  if (day % 7 === 0) rate = 55; // Red
  else if (day % 5 === 0) rate = 72; // Orange
  else if (day % 3 === 0) rate = 88; // Light Green
  return { day, rate };
});

const Attendance = () => {
  // Mode toggle: 'student' or 'faculty'
  const [viewMode, setViewMode] = useState('student');
  const [activeTab, setActiveTab] = useState('subject-wise');

  // Faculty View states
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedSubject, setSelectedSubject] = useState("CS601 - Advanced Web Tech");
  const [roster, setRoster] = useState(initialRoster);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Calculate live summary counters for faculty view
  const facultyPresentCount = roster.filter(s => s.status === 'Present').length;
  const facultyAbsentCount = roster.filter(s => s.status === 'Absent').length;
  const facultyTotalCount = roster.length;

  // --- STUDENT MOCK DATA ---
  const studentSummary = { overall: 82, totalClasses: 120, present: 98, absent: 22 };
  
  const subjectData = [
    { subject: 'Data Structures', attended: 28, total: 30, pct: 93, status: 'Good' },
    { subject: 'DBMS', attended: 24, total: 30, pct: 80, status: 'Good' },
    { subject: 'Operating Sys', attended: 18, total: 30, pct: 60, status: 'Warning' },
    { subject: 'Mathematics', attended: 12, total: 30, pct: 40, status: 'Critical' },
  ];
  
  const pieData = [
    { name: 'Present', value: 98, color: '#10B981' }, 
    { name: 'Absent', value: 22, color: '#EF4444' }, 
  ];

  const getStatusClass = (status) => {
    if (status === 'Good') return 'status-good';
    if (status === 'Warning') return 'status-warning';
    return 'status-critical';
  };

  // --- FACULTY MARK HANDLERS ---
  const handleToggleStatus = (id, nextStatus) => {
    setRoster(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));
  };

  const handleBulkMark = (status) => {
    if (selectedStudents.length === 0) {
      // Mark everyone if none selected
      setRoster(prev => prev.map(s => ({ ...s, status })));
    } else {
      // Mark selected students
      setRoster(prev => prev.map(s => selectedStudents.includes(s.id) ? { ...s, status } : s));
      setSelectedStudents([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(roster.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  return (
    <div className="attendance-container">
      
      {/* HEADER WITH VIEW MODE TOGGLER */}
      <div className="attendance-header-panel">
        <div>
          <h2>Attendance Module 📅</h2>
          <p>
            {viewMode === 'student' 
              ? "Track your semester attendance averages and logs" 
              : "Manage student roster attendance and inspect metrics"}
          </p>
        </div>
        
        <button className="view-mode-toggle-btn" onClick={() => setViewMode(viewMode === 'student' ? 'faculty' : 'student')}>
          <FaExchangeAlt /> Switch to {viewMode === 'student' ? "Faculty Panel" : "Student Panel"}
        </button>
      </div>

      {/* ======================================================== */}
      {/* 👨‍🏫 FACULTY VIEW: ATTENDANCE MARKER PANEL */}
      {/* ======================================================== */}
      {viewMode === 'faculty' && (
        <div className="faculty-attendance-view animate-fade">
          
          {/* CONTROL BAR */}
          <div className="faculty-filters-bar">
            <div className="faculty-filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="fac-date-input"
              />
            </div>
            
            <div className="faculty-filter-group">
              <label>Subject:</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="fac-subject-select">
                <option value="CS601 - Advanced Web Tech">CS601 - Advanced Web Tech</option>
                <option value="CS602 - Cloud Computing">CS602 - Cloud Computing</option>
                <option value="CS603 - Data Analytics">CS603 - Data Analytics</option>
              </select>
            </div>
          </div>

          {/* CLASS SUMMARY COUNTERS */}
          <div className="faculty-stats-summary">
            <div className="summary-card stat-total">
              <span className="summary-title">Total Roster</span>
              <div className="summary-value color-blue">{facultyTotalCount}</div>
            </div>
            
            <div className="summary-card stat-present">
              <span className="summary-title">Present Count</span>
              <div className="summary-value color-green">{facultyPresentCount}</div>
              <span className="summary-sub">Avg Rate: {Math.round((facultyPresentCount / facultyTotalCount) * 100)}%</span>
            </div>

            <div className="summary-card stat-absent">
              <span className="summary-title">Absent Count</span>
              <div className="summary-value color-red">{facultyAbsentCount}</div>
              <span className="summary-sub">Absent Rate: {Math.round((facultyAbsentCount / facultyTotalCount) * 100)}%</span>
            </div>
          </div>

          {/* ATTENDANCE HEATMAP (Last 30 Days) */}
          <div className="dashboard-card heatmap-card-section">
            <div className="heatmap-info-header">
              <h3>Class Attendance Heatmap</h3>
              <p>Visual map of daily attendance rates over the last 30 calendar days</p>
            </div>
            
            <div className="heatmap-grid-layout">
              {mockHeatmapData.map((data) => {
                let colorClass = "rate-high";
                if (data.rate < 60) colorClass = "rate-critical";
                else if (data.rate < 75) colorClass = "rate-warning";
                else if (data.rate < 90) colorClass = "rate-mid";
                return (
                  <div 
                    key={data.day} 
                    className={`heatmap-cell-node ${colorClass}`}
                    title={`Day ${data.day}: Attendance ${data.rate}%`}
                  >
                    <span className="cell-number">{data.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="heatmap-legend-line">
              <span className="legend-text">Less</span>
              <div className="legend-cell rate-critical" title="<60% Attendance" />
              <div className="legend-cell rate-warning" title="60%-74% Attendance" />
              <div className="legend-cell rate-mid" title="75%-89% Attendance" />
              <div className="legend-cell rate-high" title="90%+ Attendance" />
              <span className="legend-text">More</span>
              <span className="legend-average-label">Average Score: <strong>92%</strong></span>
            </div>
          </div>

          {/* STUDENT ROSTER LISTING */}
          <div className="dashboard-card roster-management-card">
            <div className="roster-header-bar">
              <h3>Student Attendance Roster</h3>
              
              <div className="bulk-mark-btn-group">
                <button type="button" className="bulk-btn present" onClick={() => handleBulkMark("Present")}>
                  <FaUserCheck /> Mark Present
                </button>
                <button type="button" className="bulk-btn absent" onClick={() => handleBulkMark("Absent")}>
                  <FaUserTimes /> Mark Absent
                </button>
              </div>
            </div>

            <div className="roster-table-wrapper">
              <table className="roster-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedStudents.length === roster.length && roster.length > 0}
                      />
                    </th>
                    <th>Roll ID</th>
                    <th>Full Name</th>
                    <th style={{ textAlign: 'center' }}>Prior Rate</th>
                    <th style={{ textAlign: 'center' }}>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((student) => (
                    <tr key={student.id} className={student.status === 'Absent' ? 'roster-row-absent' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedStudents.includes(student.id)} 
                          onChange={() => handleSelectRow(student.id)}
                        />
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{student.roll}</td>
                      <td style={{ fontWeight: '600' }}>{student.name}</td>
                      <td style={{ textAlign: 'center', fontWeight: '700' }}>
                        <span style={{ color: student.prevPct < 75 ? 'var(--danger)' : 'var(--success)' }}>
                          {student.prevPct}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="toggle-badge-group">
                          <button 
                            type="button" 
                            className={`toggle-state-btn present ${student.status === 'Present' ? 'active' : ''}`}
                            onClick={() => handleToggleStatus(student.id, "Present")}
                          >
                            <FaCheck size={10} /> Present
                          </button>
                          
                          <button 
                            type="button" 
                            className={`toggle-state-btn absent ${student.status === 'Absent' ? 'active' : ''}`}
                            onClick={() => handleToggleStatus(student.id, "Absent")}
                          >
                            <FaTimes size={10} /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 🎓 STUDENT VIEW: ANALYTICS & LOGS PANEL */}
      {/* ======================================================== */}
      {viewMode === 'student' && (
        <div className="student-attendance-view animate-fade">
          
          {/* SUMMARY CARDS */}
          <div className="attendance-summary">
            <div className="summary-card">
              <div className="summary-title">Overall Attendance</div>
              <div>
                <div className={`summary-value ${studentSummary.overall < 75 ? 'color-red' : 'color-green'}`}>
                  {studentSummary.overall}%
                </div>
                <div className="progress-track">
                  <div 
                    className={`progress-fill ${studentSummary.overall < 75 ? 'bg-red' : 'bg-green'}`} 
                    style={{ width: `${studentSummary.overall}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Total Classes</div>
              <div className="summary-value color-blue">{studentSummary.totalClasses}</div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Present</div>
              <div className="summary-value color-green">{studentSummary.present}</div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Absent</div>
              <div className="summary-value color-red">{studentSummary.absent}</div>
            </div>
          </div>

          {/* CHARTS GRID */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Subject-wise Attendance</h3>
                <p style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Performance across all courses</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)', fontSize:12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)'}} />
                  <Tooltip cursor={{fill: 'var(--border-light)'}} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Bar dataKey="pct" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <h3>Overall Split</h3>
                <p style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Present vs Absent Ratio</p>
              </div>
              <div style={{ position: 'relative', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{studentSummary.overall}%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average</div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS SELECTOR */}
          <div style={{ paddingBottom: '40px' }}>
            <div className="attendance-filter-tabs">
              {['subject-wise', 'log', 'monthly', 'overall'].map(tab => (
                <button 
                  key={tab}
                  className={`filter-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* CONTENT AREA */}
            <div className="table-card" style={{ borderTop: 'none', borderRadius: '0 0 16px 16px', backgroundColor: 'var(--card-bg)' }}>
              
              {/* SUBJECT-WISE TABLE */}
              {activeTab === 'subject-wise' && (
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Total Classes</th>
                      <th>Attended</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.map((row, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.subject}</td>
                        <td>{row.total}</td>
                        <td>{row.attended}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: '700', width: '30px', color: 'var(--text-primary)' }}>{row.pct}%</span>
                            <div className="progress-track" style={{ width: '80px', marginTop: 0, height: '6px', backgroundColor: 'var(--border-light)' }}>
                              <div 
                                className="progress-fill" 
                                style={{ 
                                  width: `${row.pct}%`, 
                                  background: row.pct < 60 ? 'var(--danger)' : (row.pct < 75 ? 'var(--warning)' : 'var(--success)') 
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* LOG VIEW */}
              {activeTab === 'log' && (
                <div className="tab-content-placeholder">
                  <div className="filter-controls-container">
                    <div className="radio-group">
                      <span className="radio-title">Show :</span>
                      <label className="radio-label">
                        <input type="radio" name="showFilter" defaultChecked /> Absent
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="showFilter" /> Present
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="showFilter" /> Both
                      </label>
                    </div>

                    <select className="subject-select" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}>
                      <option>CS601 - Advanced Web Tech</option>
                      <option>CS101 - Data Structures</option>
                      <option>CS102 - DBMS</option>
                    </select>
                  </div>

                  <div className="info-box-blue" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', color: 'var(--primary)', borderColor: 'rgba(37, 99, 235, 0.15)' }}>
                    <FaInfoCircle size={20} />
                    <span>No log found!</span>
                  </div>
                </div>
              )}

              {/* MONTHLY VIEW */}
              {activeTab === 'monthly' && (
                <div className="tab-content-placeholder">
                   <div className="info-box-blue" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', color: 'var(--primary)', borderColor: 'rgba(37, 99, 235, 0.15)' }}>
                    <FaInfoCircle size={20} />
                    <span>Select a month to view the summary.</span>
                  </div>
                </div>
              )}

              {/* OVERALL VIEW */}
              {activeTab === 'overall' && (
                <div className="tab-content-placeholder">
                   <div className="info-box-blue" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', color: 'var(--primary)', borderColor: 'rgba(37, 99, 235, 0.15)' }}>
                    <FaInfoCircle size={20} />
                    <span>Detailed overall report generation.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Attendance;