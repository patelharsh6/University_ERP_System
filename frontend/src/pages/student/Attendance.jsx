// src/pages/student/Attendance.jsx
import React, { useState } from 'react';
import './Attendance.css';
import { FiFilter } from 'react-icons/fi';

const Attendance = () => {
  const [semester, setSemester] = useState("6");
  const [month, setMonth] = useState("March");

  // Mock data matching the specific user requirements
  const overallStats = {
    present: 45,
    absent: 5,
    leave: 2,
    percentage: 90
  };

  const subjectWise = [
    { id: 1, name: 'Database Management Systems (DBMS)', pct: 95 },
    { id: 2, name: 'Operating Systems (OS)', pct: 85 },
    { id: 3, name: 'Artificial Intelligence (AI)', pct: 92 },
    { id: 4, name: 'Computer Networks (CN)', pct: 88 },
  ];

  // Mock Calendar Heatmap for a month (e.g., 31 days)
  // 0: empty (offset), 1: present, 2: absent, 3: leave, 4: future/no class
  const calendarData = [
    { day: '', status: 0 }, { day: '', status: 0 }, { day: '', status: 0 }, // Offset
    { day: 1, status: 1 }, { day: 2, status: 1 }, { day: 3, status: 2 }, { day: 4, status: 4 },
    { day: 5, status: 1 }, { day: 6, status: 1 }, { day: 7, status: 1 }, { day: 8, status: 1 }, { day: 9, status: 1 }, { day: 10, status: 4 }, { day: 11, status: 4 },
    { day: 12, status: 1 }, { day: 13, status: 1 }, { day: 14, status: 3 }, { day: 15, status: 3 }, { day: 16, status: 1 }, { day: 17, status: 4 }, { day: 18, status: 4 },
    { day: 19, status: 1 }, { day: 20, status: 1 }, { day: 21, status: 1 }, { day: 22, status: 2 }, { day: 23, status: 1 }, { day: 24, status: 4 }, { day: 25, status: 4 },
    { day: 26, status: 1 }, { day: 27, status: 1 }, { day: 28, status: 1 }, { day: 29, status: 1 }, { day: 30, status: 1 }, { day: 31, status: 4 }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 1: return 'present';
      case 2: return 'absent';
      case 3: return 'leave';
      case 0: return 'empty';
      default: return 'none';
    }
  };

  const getProgressFill = (pct) => {
    if (pct >= 90) return 'fill-good';
    if (pct >= 75) return 'fill-warn';
    return 'fill-bad';
  };

  return (
    <div className="attendance-container">
      
      {/* HEADER & FILTERS */}
      <div className="attendance-header">
        <h1>Attendance Tracker</h1>
        <div className="attendance-filters">
          <select 
            className="att-select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>
          <select 
            className="att-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
          </select>
        </div>
      </div>

      {/* OVERALL STATS */}
      <div className="att-stats-grid">
        <div className="att-stat-card stat-total">
          <span className="att-stat-title">Overall Percentage</span>
          <span className="att-stat-value">{overallStats.percentage}%</span>
        </div>
        <div className="att-stat-card stat-present">
          <span className="att-stat-title">Present Days</span>
          <span className="att-stat-value">{overallStats.present}</span>
        </div>
        <div className="att-stat-card stat-absent">
          <span className="att-stat-title">Absent Days</span>
          <span className="att-stat-value">{overallStats.absent}</span>
        </div>
        <div className="att-stat-card stat-leave">
          <span className="att-stat-title">Leave Days</span>
          <span className="att-stat-value">{overallStats.leave}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="att-main-grid">
        
        {/* Subject Wise List */}
        <div className="att-card">
          <h2 className="att-card-title">Subject Wise Attendance</h2>
          <table className="att-subject-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th style={{ width: '80px', textAlign: 'right' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {subjectWise.map(subject => (
                <tr key={subject.id}>
                  <td>
                    <div className="subject-name-cell">{subject.name}</div>
                    <div className="att-progress-bar">
                      <div 
                        className={`att-progress-fill ${getProgressFill(subject.pct)}`}
                        style={{ width: `${subject.pct}%` }}
                      ></div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800' }}>
                    {subject.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calendar Heatmap */}
        <div className="att-card">
          <h2 className="att-card-title">Calendar View ({month})</h2>
          
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {calendarData.map((d, i) => (
              <div key={i} className={`calendar-cell ${getStatusClass(d.status)}`}>
                {d.day}
              </div>
            ))}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-dot present"></div> Present
            </div>
            <div className="legend-item">
              <div className="legend-dot absent"></div> Absent
            </div>
            <div className="legend-item">
              <div className="legend-dot leave"></div> Leave
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Attendance;