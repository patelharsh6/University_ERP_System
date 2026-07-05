// src/pages/student/Attendance.jsx
import React, { useState, useMemo } from 'react';
import './Attendance.css';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const SEMESTER_OPTIONS = [
  '2025-26, SEMESTER-V, BTech-CSE(AI-ML)',
  '2024-25, SEMESTER-IV, BTech-CSE(AI-ML)',
];

const SUBJECTS = [
  { code: 'ECSAJ24301', name: 'Business Models C...', present: 12, total: 15, pct: 80 },
  { code: 'ECSCI24302', name: 'Cloud Infrastructure', present: 57, total: 65, pct: 88 },
  { code: 'ECSCP24303', name: 'Cloud Programming', present: 50, total: 62, pct: 81 },
  { code: 'ECSCT24301', name: 'Cloud Technologies', present: 28, total: 35, pct: 80 },
  { code: 'EICD24303',  name: 'IoT Cloud Design',   present: 60, total: 73, pct: 82 },  // will show as "low" bar
  { code: 'EICET24304', name: 'IoT Edge Tech',       present: 47, total: 66, pct: 71 },
];

// Attendance log – entries per subject
const ATTENDANCE_LOG = {
  'ECSAJ24301': [
    { date: '19-Nov-2025 (09:10 - 10:50)', status: 'Absent' },
    { date: '01-Oct-2025 (09:10 - 10:50)', status: 'Absent' },
    { date: '24-Sep-2025 (09:10 - 10:50)', status: 'Absent' },
    { date: '10-Sep-2025 (10:50 - 12:30)', status: 'Present' },
    { date: '27-Aug-2025 (09:10 - 10:50)', status: 'Present' },
  ],
  'ECSCI24302': [
    { date: '22-Nov-2025 (10:50 - 12:30)', status: 'Present' },
    { date: '15-Nov-2025 (09:10 - 10:50)', status: 'Present' },
    { date: '08-Nov-2025 (09:10 - 10:50)', status: 'Absent' },
    { date: '01-Nov-2025 (10:50 - 12:30)', status: 'Present' },
  ],
  'ECSCP24303': [
    { date: '21-Nov-2025 (12:30 - 14:10)', status: 'Present' },
    { date: '14-Nov-2025 (09:10 - 10:50)', status: 'Absent' },
    { date: '07-Nov-2025 (12:30 - 14:10)', status: 'Present' },
  ],
  'ECSCT24301': [
    { date: '20-Nov-2025 (14:10 - 15:50)', status: 'Present' },
    { date: '13-Nov-2025 (09:10 - 10:50)', status: 'Absent' },
  ],
  'EICD24303': [
    { date: '18-Nov-2025 (09:10 - 10:50)', status: 'Present' },
    { date: '11-Nov-2025 (10:50 - 12:30)', status: 'Absent' },
    { date: '04-Nov-2025 (09:10 - 10:50)', status: 'Present' },
  ],
  'EICET24304': [
    { date: '17-Nov-2025 (12:30 - 14:10)', status: 'Absent' },
    { date: '10-Nov-2025 (09:10 - 10:50)', status: 'Absent' },
    { date: '03-Nov-2025 (12:30 - 14:10)', status: 'Present' },
  ],
};

// Overall stats
const OVERALL = { present: 254, total: 316, pct: 82 };

// Monthly stats
const MONTHLY = { present: 0, total: 0, pct: 0, month: 'Jul-2026' };

const TABS = ['Subject-wise', 'Log', 'Monthly', 'Over all'];

// ─── Custom Donut Label ───────────────────────────────────────────────────────
const DonutLabel = ({ cx, cy, pct, color }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
    <tspan x={cx} dy="-4" fontSize="22" fontWeight="700" fill={color}>{pct}%</tspan>
  </text>
);

// ─── Custom Tooltip for Bar ───────────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="att2-tooltip">
        <div className="att2-tooltip-title">{d.code}</div>
        <div className="att2-tooltip-sub">{d.name}</div>
        <div className="att2-tooltip-stat">{d.present}/{d.total} periods</div>
        <div className="att2-tooltip-pct" style={{ color: d.pct >= 75 ? '#2563eb' : '#ef4444' }}>
          {d.pct}% attendance
        </div>
      </div>
    );
  }
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────
const Attendance = () => {
  const [activeTab, setActiveTab]       = useState('Over all');
  const [semester, setSemester]         = useState(SEMESTER_OPTIONS[0]);
  const [showSemDrop, setShowSemDrop]   = useState(false);
  const [logFilter, setLogFilter]       = useState('Absent');          // 'Absent' | 'Present' | 'Both'
  const [selectedSubject, setSelectedSubject] = useState('ECSAJ24301');

  // Log entries filtered
  const logEntries = useMemo(() => {
    const raw = ATTENDANCE_LOG[selectedSubject] || [];
    if (logFilter === 'Both') return raw;
    return raw.filter(e => e.status === logFilter);
  }, [selectedSubject, logFilter]);

  // Bar chart data – colour by pct
  const barData = SUBJECTS.map(s => ({
    ...s,
    fill: s.pct >= 75 ? '#2563eb' : '#ef4444',
    label: `${s.code}\n${s.pct}% (${s.present}/${s.total})`,
  }));

  // Donut slices
  const buildDonut = (pct) => [
    { value: pct, color: pct >= 75 ? '#2563eb' : '#ef4444' },
    { value: 100 - pct, color: '#e5e7eb' },
  ];

  const overallSlices  = buildDonut(OVERALL.pct);
  const monthlySlices  = buildDonut(MONTHLY.pct);

  return (
    <div className="att2-container">

      {/* ── Header ── */}
      <div className="att2-header">
        <div className="att2-header-left">
          <h1 className="att2-title">Attendance % / 2025-26</h1>
        </div>
      </div>

      {/* ── Semester Dropdown ── */}
      <div className="att2-sem-wrap">
        <button
          className="att2-sem-btn"
          onClick={() => setShowSemDrop(v => !v)}
        >
          <span>{semester}</span>
          <FiChevronDown className={`att2-chevron ${showSemDrop ? 'open' : ''}`} />
        </button>
        <AnimatePresence>
          {showSemDrop && (
            <motion.div
              className="att2-sem-dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {SEMESTER_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`att2-sem-option ${opt === semester ? 'active' : ''}`}
                  onClick={() => { setSemester(opt); setShowSemDrop(false); }}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tabs ── */}
      <div className="att2-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`att2-tab ${activeTab === tab ? 'att2-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <motion.div className="att2-tab-underline" layoutId="att2-underline" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">

        {/* OVERALL TAB */}
        {activeTab === 'Over all' && (
          <motion.div
            key="overall"
            className="att2-tab-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="att2-donut-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={overallSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {overallSlices.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="att2-donut-center">
                <span className="att2-donut-pct" style={{ color: OVERALL.pct >= 75 ? '#2563eb' : '#ef4444' }}>
                  {OVERALL.pct}%
                </span>
              </div>
            </div>

            <div className="att2-overall-stats">
              <div className="att2-stat-row">
                <span className="att2-stat-label">Overall percentage:</span>
                <span className="att2-stat-val" style={{ color: '#2563eb', fontWeight: 700 }}>{OVERALL.pct}%</span>
              </div>
              <div className="att2-stat-row">
                <span className="att2-stat-label">No. of periods present:</span>
                <span className="att2-stat-val">{OVERALL.present}/{OVERALL.total}</span>
              </div>
            </div>

            {/* Mini subject breakdown */}
            <div className="att2-subject-mini-list">
              {SUBJECTS.map(sub => (
                <div key={sub.code} className="att2-subject-mini-row">
                  <div className="att2-subject-mini-info">
                    <span className="att2-mini-code">{sub.code}</span>
                    <span className="att2-mini-name">{sub.name}</span>
                  </div>
                  <div className="att2-mini-bar-wrap">
                    <div className="att2-mini-bar">
                      <div
                        className="att2-mini-bar-fill"
                        style={{
                          width: `${sub.pct}%`,
                          background: sub.pct >= 75 ? '#2563eb' : '#ef4444',
                        }}
                      />
                    </div>
                    <span
                      className="att2-mini-pct"
                      style={{ color: sub.pct >= 75 ? '#2563eb' : '#ef4444' }}
                    >
                      {sub.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBJECT-WISE TAB */}
        {activeTab === 'Subject-wise' && (
          <motion.div
            key="subject"
            className="att2-tab-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="att2-bar-chart-wrap">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 80 }}
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="code"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="att2-bar-legend">
              <div className="att2-legend-item">
                <span className="att2-legend-dot" style={{ background: '#2563eb' }} />
                <span>≥ 75% (Good)</span>
              </div>
              <div className="att2-legend-item">
                <span className="att2-legend-dot" style={{ background: '#ef4444' }} />
                <span>&lt; 75% (Low)</span>
              </div>
            </div>

            {/* Detailed table */}
            <div className="att2-subject-table-wrap">
              <table className="att2-subject-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject</th>
                    <th>Present</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map(sub => (
                    <tr key={sub.code}>
                      <td className="att2-code-cell">{sub.code}</td>
                      <td>{sub.name}</td>
                      <td>{sub.present}</td>
                      <td>{sub.total}</td>
                      <td>
                        <span
                          className="att2-pct-badge"
                          style={{
                            background: sub.pct >= 75 ? 'rgba(37,99,235,0.1)' : 'rgba(239,68,68,0.1)',
                            color: sub.pct >= 75 ? '#2563eb' : '#ef4444',
                          }}
                        >
                          {sub.pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* LOG TAB */}
        {activeTab === 'Log' && (
          <motion.div
            key="log"
            className="att2-tab-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {/* Show filter */}
            <div className="att2-log-filter-group">
              <span className="att2-log-filter-label">Show:</span>
              <div className="att2-radio-group">
                {['Absent', 'Present', 'Both'].map(opt => (
                  <label key={opt} className="att2-radio-label">
                    <input
                      type="radio"
                      name="logFilter"
                      value={opt}
                      checked={logFilter === opt}
                      onChange={() => setLogFilter(opt)}
                      className="att2-radio"
                    />
                    <span className="att2-radio-custom" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Subject selector */}
            <div className="att2-subject-selector">
              <select
                className="att2-subject-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                {SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="att2-select-icon" />
            </div>

            {/* Log entries */}
            <div className="att2-log-list">
              {logEntries.length === 0 ? (
                <div className="att2-log-empty">No records found for selected filter.</div>
              ) : (
                logEntries.map((entry, i) => (
                  <motion.div
                    key={i}
                    className="att2-log-card"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="att2-log-row">
                      <span className="att2-log-field">DATE</span>
                      <span className="att2-log-value">{entry.date}</span>
                    </div>
                    <div className="att2-log-row">
                      <span className="att2-log-field">STATUS</span>
                      <span
                        className={`att2-status-badge ${entry.status === 'Present' ? 'status-present' : 'status-absent'}`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* MONTHLY TAB */}
        {activeTab === 'Monthly' && (
          <motion.div
            key="monthly"
            className="att2-tab-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="att2-donut-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={monthlySlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {monthlySlices.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="att2-donut-center">
                <span className="att2-donut-pct" style={{ color: '#6b7280' }}>
                  {MONTHLY.pct}%
                </span>
              </div>
            </div>

            <div className="att2-overall-stats">
              <div className="att2-stat-row">
                <span className="att2-stat-label">Current semester attendance:</span>
                <span className="att2-stat-val">{MONTHLY.pct}%</span>
              </div>
              <div className="att2-stat-row">
                <span className="att2-stat-label">No. of periods present:</span>
                <span className="att2-stat-val att2-not-recorded">Not Recorded</span>
              </div>
              <div className="att2-stat-row">
                <span className="att2-stat-label">Current month:</span>
                <span className="att2-stat-val">{MONTHLY.month}</span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Attendance;