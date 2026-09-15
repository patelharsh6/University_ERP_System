// src/pages/student/Results.jsx
import React, { useState, useEffect } from 'react';
import './Results.css';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { FiFileText, FiPrinter, FiAward, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import { getGradeBadgeClass } from '../../utils/grade';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const BAR_COLORS = ['#3b82f6', '#0d9488', '#059669', '#d97706', '#8b5cf6', '#ec4899', '#f59e0b'];

const Results = () => {
  const { data: transcript, loading, error, refetch } = useApi(endpoints.results.transcript);
  const [selectedSemName, setSelectedSemName] = useState('');

  const semesters = transcript?.semesters || [];

  useEffect(() => {
    if (semesters.length > 0 && !selectedSemName) {
      setSelectedSemName(semesters[semesters.length - 1].semester);
    }
  }, [semesters, selectedSemName]);

  const currentSemData = semesters.find(s => s.semester === selectedSemName) || semesters[semesters.length - 1] || {
    semester: 'Current',
    sgpa: 0,
    credits_earned: 0,
    results: []
  };

  const resultsData = (currentSemData.results || []).map((r, idx) => ({
    code: r.subject_code || `SUB${idx + 1}`,
    subject: r.subject_name || 'Subject',
    internal: Math.round(r.marks_obtained * 0.4),
    external: Math.round(r.marks_obtained * 0.6),
    total: Math.round(r.marks_obtained),
    grade: r.grade || 'A',
    result: r.grade === 'F' ? 'FAIL' : 'PASS',
    color: r.grade === 'F' ? '#dc2626' : BAR_COLORS[idx % BAR_COLORS.length]
  }));

  const sgpaTrend = semesters.map((s, idx) => ({
    semester: s.semester ? `Sem ${s.semester.replace(/[^0-9]/g, '') || (idx + 1)}` : `Sem ${idx + 1}`,
    sgpa: s.sgpa
  }));

  const hasFails = resultsData.some(r => r.result === 'FAIL');
  const currentSummary = {
    sgpa: currentSemData.sgpa || 0,
    cgpa: transcript?.cgpa || 0,
    totalCredits: currentSemData.credits_earned || transcript?.total_credits_earned || 0,
    status: hasFails ? 'FAIL' : 'PASS'
  };

  if (loading) {
    return (
      <div className="results-container" style={{ padding: '24px' }}>
        <Skeleton variant="card" height={60} style={{ marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <Skeleton variant="card" height={160} />
          <Skeleton variant="card" height={160} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <Skeleton variant="card" height={220} />
          <Skeleton variant="card" height={220} />
        </div>
        <Skeleton variant="table" rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container" style={{ padding: '24px' }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (semesters.length === 0) {
    return (
      <div className="results-container" style={{ padding: '24px' }}>
        <EmptyState
          icon={FiAward}
          title="No Published Results Yet"
          description="Examination marks and academic transcripts will appear here once officially published by the examination cell."
        />
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* HEADER & SELECT */}
      <div className="results-header">
        <h1><FiAward style={{ color: 'var(--res-warning)' }} /> Examination Results</h1>
        <select 
          className="semester-select" 
          value={selectedSemName} 
          onChange={(e) => setSelectedSemName(e.target.value)}
        >
          {semesters.map((s, idx) => (
            <option key={idx} value={s.semester}>
              Semester {s.semester} (SGPA: {s.sgpa})
            </option>
          ))}
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
            <h4>{currentSummary.cgpa >= 8.5 ? 'Outstanding Academic Standing' : currentSummary.cgpa >= 7.0 ? 'Good Academic Standing' : 'Satisfactory Standing'}</h4>
            <p>{transcript?.student_name ? `${transcript.student_name} (${transcript.enrollment_id || 'Enrolled'})` : 'Cumulative Grade Point Average'}</p>
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
            {resultsData.length === 0 ? (
              <p style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No scores available for this semester</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={resultsData} margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="code" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--res-text-secondary)', fontWeight: '600', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name, props) => [`${value}/100`, props.payload.subject]}
                    contentStyle={{ background: 'var(--res-card-bg)', border: '1px solid var(--res-card-border)', borderRadius: '8px', color: 'var(--res-text-primary)' }}
                  />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={14}>
                    {resultsData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="res-dashboard-card chart-card-box">
          <div className="chart-info-header">
            <h3><FiTrendingUp /> Academic Trend</h3>
            <p>Semester-wise SGPA trajectory</p>
          </div>
          <div style={{ height: '220px', width: '100%', marginTop: '16px' }}>
            {sgpaTrend.length === 0 ? (
              <p style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No historical trend data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sgpaTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--res-card-border)" />
                  <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: 'var(--res-text-muted)', fontSize: 11 }} dy={10} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: 'var(--res-text-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--res-card-bg)', border: '1px solid var(--res-card-border)', borderRadius: '8px', color: 'var(--res-text-primary)' }} />
                  <Line type="monotone" dataKey="sgpa" stroke="var(--res-accent)" strokeWidth={3} dot={{ r: 5, fill: 'var(--res-accent)' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
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
                <th className="num-col">Internal (40)</th>
                <th className="num-col">External (60)</th>
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
                    <span className={`grade-badge ${getGradeBadgeClass(row.grade)}`}>{row.grade}</span>
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
        <button className="btn-action btn-download-pdf" onClick={() => window.print()}>
          <FiFileText /> Download Marksheet
        </button>
      </div>
    </div>
  );
};

export default Results;