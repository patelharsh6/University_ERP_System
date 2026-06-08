// src/pages/student/Results.jsx
import React, { useState } from 'react';
import './Results.css';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { FaFilePdf, FaPrint, FaTrophy, FaChartLine, FaGraduationCap } from 'react-icons/fa';

const Results = () => {
  const [selectedSem, setSelectedSem] = useState(6);

  // --- MOCK DATA: SGPA TREND (For Line Graph) ---
  const sgpaTrend = [
    { semester: 'Sem 1', sgpa: 7.8 },
    { semester: 'Sem 2', sgpa: 8.1 },
    { semester: 'Sem 3', sgpa: 7.9 },
    { semester: 'Sem 4', sgpa: 8.4 },
    { semester: 'Sem 5', sgpa: 8.6 },
    { semester: 'Sem 6', sgpa: 8.8 },
  ];

  // --- MOCK DATA: SUBJECT RESULTS (For Table) ---
  const resultsData = [
    { code: "CS601", subject: "Advanced Web Tech", score: 86, internal: 28, external: 58, total: 86, grade: "A", credits: 4, result: "PASS", color: "#2563EB" },
    { code: "CS602", subject: "Cloud Computing", score: 75, internal: 25, external: 50, total: 75, grade: "B", credits: 4, result: "PASS", color: "#06B6D4" },
    { code: "CS603", subject: "Data Analytics", score: 94, internal: 29, external: 65, total: 94, grade: "A+", credits: 4, result: "PASS", color: "#10B981" },
    { code: "CS604", subject: "Software Engineering", score: 32, internal: 12, external: 20, total: 32, grade: "F", credits: 3, result: "FAIL", color: "#EF4444" },
    { code: "CS605", subject: "Project Phase I", score: 93, internal: 48, external: 45, total: 93, grade: "A+", credits: 6, result: "PASS", color: "#F59E0B" },
  ];

  const currentSummary = {
    sgpa: 8.72,
    cgpa: 8.6,
    totalCredits: 21,
    status: "FAIL" // FAIL because CS604 has F
  };

  const getGradeClass = (grade) => {
    if (grade === 'A' || grade === 'A+') return 'grade-A';
    if (grade === 'B') return 'grade-B';
    if (grade === 'C') return 'grade-C';
    return 'grade-F';
  };

  return (
    <div className="results-container">
      
      {/* HEADER & SEMESTER SELECT */}
      <div className="results-header">
        <h2><FaTrophy style={{ color: '#F59E0B' }} /> Examination Results</h2>
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

      {/* RATING SUMMARY ROW */}
      <div className="results-metrics-panel">
        
        {/* GPA/CGPA CIRCULAR SCORE CARD */}
        <div className="dashboard-card cgpa-circular-score-card">
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

        {/* DETAILS INFO MINI CARDS */}
        <div className="mini-cards-column">
          <div className="dashboard-card mini-metric-card">
            <div className="mini-label">Current Sem SGPA</div>
            <div className="mini-value" style={{ color: 'var(--primary)' }}>{currentSummary.sgpa}</div>
          </div>
          <div className="dashboard-card mini-metric-card">
            <div className="mini-label">Total Semester Credits</div>
            <div className="mini-value" style={{ color: 'var(--text-primary)' }}>{currentSummary.totalCredits}</div>
          </div>
          <div className="dashboard-card mini-metric-card">
            <div className="mini-label">Overall Evaluation</div>
            <span className={`badge-pill ${currentSummary.status === 'PASS' ? 'success' : 'danger'}`} style={{ width: 'fit-content', fontSize: '0.85rem' }}>
              {currentSummary.status}
            </span>
          </div>
        </div>

      </div>

      {/* CHARTS ROW (Horizontal Bar + Line Chart) */}
      <div className="results-charts-row">
        
        {/* Chart 1: Subject Performance Horizontal Bar */}
        <div className="dashboard-card chart-card-box">
          <div className="chart-info-header">
            <h3><FaGraduationCap /> Subject Performance</h3>
            <p>Evaluation scores out of 100 for current semester</p>
          </div>
          
          <div style={{ height: '220px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={resultsData}
                margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="code" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontWeight: 'bold', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name, props) => [value + "/100", props.payload.subject]}
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                  {resultsData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Academic Trend Line */}
        <div className="dashboard-card chart-card-box">
          <div className="chart-info-header">
            <h3><FaChartLine /> Academic Trend</h3>
            <p>Semester-wise SGPA trajectory</p>
          </div>
          
          <div style={{ height: '220px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="sgpa" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: 'var(--primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SUBJECT MARKS TABLE */}
      <div className="dashboard-card marks-table-card">
        <h3>Detailed Grade Ledger</h3>
        <div className="marks-table-wrapper" style={{ marginTop: '16px' }}>
          <table className="styled-marks-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th className="num-col">Internal (50)</th>
                <th className="num-col">External (100)</th>
                <th className="num-col">Total (150)</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((row, index) => (
                <tr key={index} className={row.result === 'FAIL' ? 'row-fail' : ''}>
                  <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{row.code}</td>
                  <td style={{ fontWeight: '600' }}>{row.subject}</td>
                  <td className="num-col">{row.internal}</td>
                  <td className="num-col">{row.external}</td>
                  <td className="num-col" style={{ fontWeight: '700' }}>{row.total}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`grade-badge ${getGradeClass(row.grade)}`}>{row.grade}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '700', color: row.result === 'PASS' ? 'var(--success)' : 'var(--danger)' }}>
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
        <button className="btn-print" onClick={() => window.print()}>
          <FaPrint /> Print Result
        </button>
        <button className="btn-download-pdf">
          <FaFilePdf /> Download Marksheet (PDF)
        </button>
      </div>

    </div>
  );
};

export default Results;