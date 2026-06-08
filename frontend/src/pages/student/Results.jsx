// src/pages/student/Results.jsx
import React, { useState } from 'react';
import './Results.css';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { FiFileText, FiPrinter, FiAward, FiTrendingUp, FiBookOpen } from 'react-icons/fi';

const Results = () => {
  const [selectedSem, setSelectedSem] = useState(6);

  // --- MOCK DATA ---
  const sgpaTrend = [
    { semester: 'Sem 1', sgpa: 7.8 },
    { semester: 'Sem 2', sgpa: 8.1 },
    { semester: 'Sem 3', sgpa: 7.9 },
    { semester: 'Sem 4', sgpa: 8.4 },
    { semester: 'Sem 5', sgpa: 8.6 },
    { semester: 'Sem 6', sgpa: 8.8 },
  ];

  const resultsData = [
    { code: "CE601", subject: "Database Management Systems", internal: 42, external: 43, total: 85, grade: "A", result: "PASS", color: "#3b82f6" },
    { code: "CE602", subject: "Artificial Intelligence", internal: 38, external: 44, total: 82, grade: "A", result: "PASS", color: "#0d9488" },
    { code: "CE603", subject: "Computer Networks", internal: 45, external: 45, total: 90, grade: "A+", result: "PASS", color: "#059669" },
    { code: "CE604", subject: "Software Engineering", internal: 12, external: 20, total: 32, grade: "F", result: "FAIL", color: "#dc2626" },
    { code: "CE605", subject: "Web Technologies Lab", internal: 48, external: 45, total: 93, grade: "A+", result: "PASS", color: "#d97706" },
  ];

  const currentSummary = {
    sgpa: 8.72,
    cgpa: 8.6,
    totalCredits: 21,
    status: "FAIL" // FAIL because CE604 has F
  };

  const getGradeClass = (grade) => {
    if (grade === 'A' || grade === 'A+') return 'grade-A';
    if (grade === 'B') return 'grade-B';
    if (grade === 'C') return 'grade-C';
    return 'grade-F';
  };

  return (
    <div className="results-container">
      
      {/* HEADER & SELECT */}
      <div className="results-header">
        <h1><FiAward style={{ color: 'var(--res-warning)' }} /> Examination Results</h1>
        <select 
          className="semester-select" 
          value={selectedSem} 
          onChange={(e) => setSelectedSem(e.target.value)}
        >
          <option value={6}>Semester 6 (Winter 2026)</option>
          <option value={5}>Semester 5 (Summer 2025)</option>
          <option value={4}>Semester 4 (Winter 2025)</option>
        </select>
      </div>

      {/* METRICS PANEL */}
      <div className="results-metrics-panel">
        
        {/* CGPA CIRCULAR CARD */}
        <div className="res-dashboard-card cgpa-circular-score-card">
          <div className="circular-progress-wrapper">
            <div className="progress-ring-circle">
              <div className="circle-inner-value">
                <span className="rating-num">{currentSummary.cgpa}</span>
                <span className="rating-label">CGPA</span>
              </div>
            </div>
          </div>
          <div className="score-details-text">
            <h4>Outstanding Standing</h4>
            <p>Ranked in the top 8% of the computer engineering branch</p>
          </div>
        </div>

        {/* MINI METRICS */}
        <div className="mini-cards-column">
          <div className="res-dashboard-card mini-metric-card">
            <div className="mini-label">Current Sem SGPA</div>
            <div className="mini-value" style={{ color: 'var(--res-accent)' }}>{currentSummary.sgpa}</div>
          </div>
          <div className="res-dashboard-card mini-metric-card">
            <div className="mini-label">Total Semester Credits</div>
            <div className="mini-value">{currentSummary.totalCredits}</div>
          </div>
          <div className="res-dashboard-card mini-metric-card">
            <div className="mini-label">Overall Evaluation</div>
            <span className={`badge-pill ${currentSummary.status === 'PASS' ? 'success' : 'danger'}`}>
              {currentSummary.status}
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="results-charts-row">
        
        <div className="res-dashboard-card chart-card-box">
          <div className="chart-info-header">
            <h3><FiBookOpen /> Subject Performance</h3>
            <p>Evaluation scores out of 100</p>
          </div>
          <div style={{ height: '220px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={resultsData} margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="code" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--res-text-secondary)', fontWeight: '600', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name, props) => [value + "/100", props.payload.subject]}
                  contentStyle={{ background: 'var(--res-card-bg)', border: '1px solid var(--res-card-border)', borderRadius: '8px', color: 'var(--res-text-primary)' }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={14}>
                  {resultsData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="res-dashboard-card chart-card-box">
          <div className="chart-info-header">
            <h3><FiTrendingUp /> Academic Trend</h3>
            <p>Semester-wise SGPA trajectory</p>
          </div>
          <div style={{ height: '220px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--res-card-border)" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: 'var(--res-text-muted)', fontSize: 11 }} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: 'var(--res-text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--res-card-bg)', border: '1px solid var(--res-card-border)', borderRadius: '8px', color: 'var(--res-text-primary)' }} />
                <Line type="monotone" dataKey="sgpa" stroke="var(--res-accent)" strokeWidth={3} dot={{ r: 5, fill: 'var(--res-accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MARKS TABLE */}
      <div className="res-dashboard-card marks-table-card">
        <h3>Detailed Grade Ledger</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="styled-marks-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th className="num-col">Internal (50)</th>
                <th className="num-col">External (50)</th>
                <th className="num-col">Total (100)</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((row, index) => (
                <tr key={index} className={row.result === 'FAIL' ? 'row-fail' : ''}>
                  <td style={{ fontWeight: '600', color: 'var(--res-text-muted)' }}>{row.code}</td>
                  <td style={{ fontWeight: '600' }}>{row.subject}</td>
                  <td className="num-col">{row.internal}</td>
                  <td className="num-col">{row.external}</td>
                  <td className="num-col" style={{ fontWeight: '700' }}>{row.total}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`grade-badge ${getGradeClass(row.grade)}`}>{row.grade}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '700', color: row.result === 'PASS' ? 'var(--res-success)' : 'var(--res-danger)' }}>
                    {row.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOWNLOAD ACTIONS */}
      <div className="result-actions">
        <button className="btn-action btn-print" onClick={() => window.print()}>
          <FiPrinter /> Print Result
        </button>
        <button className="btn-action btn-download-pdf">
          <FiFileText /> Download Marksheet
        </button>
      </div>

    </div>
  );
};

export default Results;