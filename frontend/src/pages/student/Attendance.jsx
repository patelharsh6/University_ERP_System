// src/pages/student/Attendance.jsx
import React, { useState, useMemo } from 'react';
import './Attendance.css';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const SEMESTER_OPTIONS = [
  '2025-26, SEMESTER-VI, BTech-CSE',
  '2024-25, SEMESTER-V, BTech-CSE',
];

const TABS = ['Subject-wise', 'Log', 'Monthly', 'Over all'];

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
  const { data: summaryData, loading: loadingSummary, error: summaryError, refetch: refetchSummary } = useApi(endpoints.attendance.summary);
  const { data: listData, loading: loadingList, error: listError, refetch: refetchList } = useApi(endpoints.attendance.list, {
    params: { page_size: 100 }
  });

  const [activeTab, setActiveTab] = useState('Over all');
  const [semester, setSemester] = useState(SEMESTER_OPTIONS[0]);
  const [showSemDrop, setShowSemDrop] = useState(false);
  const [logFilter, setLogFilter] = useState('Both'); // 'Absent' | 'Present' | 'Both'
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('ALL');

  // Overall analytics
  const overallPct = summaryData?.overall_percentage ?? 0;
  const overallPresent = (summaryData?.present || 0) + (summaryData?.late || 0);
  const overallTotal = summaryData?.total_records || 0;

  // Subjects breakdown
  const subjects = useMemo(() => {
    if (!summaryData?.subjects || summaryData.subjects.length === 0) {
      return [];
    }
    return summaryData.subjects.map(s => ({
      code: s.subject_code || 'SUB',
      name: s.subject_name || 'Subject',
      present: s.attended_classes || 0,
      total: s.total_classes || 0,
      pct: s.percentage || 0,
    }));
  }, [summaryData]);

  // Attendance log entries
  const rawLogs = useMemo(() => {
    return Array.isArray(listData) ? listData : (listData?.results || []);
  }, [listData]);

  const normalizedLogs = useMemo(() => {
    return rawLogs.map(r => ({
      id: r.id,
      subjectCode: r.subject_name ? r.subject_name.split(' ')[0] : 'SUB',
      subjectName: r.subject_name || 'Subject',
      date: r.date ? formatDate(r.date) : 'Recent',
      status: r.status === 'present' ? 'Present' : r.status === 'late' ? 'Late' : 'Absent',
    }));
  }, [rawLogs]);

  // Filtered log entries
  const filteredLogs = useMemo(() => {
    return normalizedLogs.filter(e => {
      const matchSubject = selectedSubjectCode === 'ALL' || e.subjectCode === selectedSubjectCode || e.subjectName.includes(selectedSubjectCode);
      const matchStatus = logFilter === 'Both' || (logFilter === 'Present' && (e.status === 'Present' || e.status === 'Late')) || (logFilter === 'Absent' && e.status === 'Absent');
      return matchSubject && matchStatus;
    });
  }, [normalizedLogs, selectedSubjectCode, logFilter]);

  // Bar chart data
  const barData = subjects.map(s => ({
    ...s,
    fill: s.pct >= 75 ? '#2563eb' : '#ef4444',
    label: `${s.code}\n${s.pct}% (${s.present}/${s.total})`,
  }));

  // Donut slices
  const buildDonut = (pct) => [
    { value: pct, color: pct >= 75 ? '#2563eb' : '#ef4444' },
    { value: Math.max(0, 100 - pct), color: '#e5e7eb' },
  ];

  const overallSlices = buildDonut(overallPct);

  const loading = loadingSummary || loadingList;
  const error = summaryError || listError;

  if (loading) {
    return (
      <div className="att2-container" style={{ padding: '24px' }}>
        <Skeleton variant="card" height={60} style={{ marginBottom: '20px' }} />
        <Skeleton variant="card" height={40} style={{ marginBottom: '20px' }} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Skeleton variant="card" height={280} width={280} style={{ borderRadius: '50%' }} />
        </div>
        <Skeleton variant="table" rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="att2-container" style={{ padding: '24px' }}>
        <ErrorState error={error} onRetry={() => { refetchSummary(); refetchList(); }} />
      </div>
    );
  }

  return (
    <div className="att2-container">
      {/* ── Header ── */}
      <div className="att2-header">
        <div className="att2-header-left">
          <h1 className="att2-title">Attendance Tracking</h1>
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
                <span className="att2-donut-pct" style={{ color: overallPct >= 75 ? '#2563eb' : '#ef4444' }}>
                  {overallPct}%
                </span>
              </div>
            </div>

            <div className="att2-overall-stats">
              <div className="att2-stat-row">
                <span className="att2-stat-label">Overall percentage:</span>
                <span className="att2-stat-val" style={{ color: overallPct >= 75 ? '#2563eb' : '#ef4444', fontWeight: 700 }}>
                  {overallPct}%
                </span>
              </div>
              <div className="att2-stat-row">
                <span className="att2-stat-label">No. of periods present:</span>
                <span className="att2-stat-val">{overallPresent}/{overallTotal}</span>
              </div>
            </div>

            {/* Mini subject breakdown */}
            <div className="att2-subject-mini-list">
              {subjects.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>No subject records recorded yet.</p>
              ) : (
                subjects.map(sub => (
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
                            width: `${Math.min(100, sub.pct)}%`,
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
                ))
              )}
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
            {subjects.length === 0 ? (
              <EmptyState
                title="No Subject Breakdown Available"
                description="Subject attendance records have not yet been registered."
              />
            ) : (
              <>
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
                    <span>≥ 75% (Good Standing)</span>
                  </div>
                  <div className="att2-legend-item">
                    <span className="att2-legend-dot" style={{ background: '#ef4444' }} />
                    <span>&lt; 75% (Shortage Warning)</span>
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
                      {subjects.map(sub => (
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
              </>
            )}
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
                {['Both', 'Present', 'Absent'].map(opt => (
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
                value={selectedSubjectCode}
                onChange={e => setSelectedSubjectCode(e.target.value)}
              >
                <option value="ALL">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="att2-select-icon" />
            </div>

            {/* Log entries */}
            <div className="att2-log-list">
              {filteredLogs.length === 0 ? (
                <div className="att2-log-empty">No records found for selected filter.</div>
              ) : (
                filteredLogs.map((entry, i) => (
                  <motion.div
                    key={entry.id || i}
                    className="att2-log-card"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="att2-log-row">
                      <span className="att2-log-field">{entry.subjectCode}</span>
                      <span className="att2-log-value">{entry.date}</span>
                    </div>
                    <div className="att2-log-row">
                      <span className="att2-log-field">STATUS</span>
                      <span
                        className={`att2-status-badge ${entry.status === 'Present' || entry.status === 'Late' ? 'status-present' : 'status-absent'}`}
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
                </PieChart>
              </ResponsiveContainer>
              <div className="att2-donut-center">
                <span className="att2-donut-pct" style={{ color: overallPct >= 75 ? '#2563eb' : '#ef4444' }}>
                  {overallPct}%
                </span>
              </div>
            </div>

            <div className="att2-overall-stats">
              <div className="att2-stat-row">
                <span className="att2-stat-label">Current semester attendance:</span>
                <span className="att2-stat-val">{overallPct}%</span>
              </div>
              <div className="att2-stat-row">
                <span className="att2-stat-label">No. of periods attended:</span>
                <span className="att2-stat-val">{overallPresent}/{overallTotal}</span>
              </div>
              <div className="att2-stat-row">
                <span className="att2-stat-label">Status:</span>
                <span className="att2-stat-val" style={{ color: overallPct >= 75 ? '#2563eb' : '#ef4444' }}>
                  {overallPct >= 75 ? 'Satisfactory' : 'Below 75% Threshold'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;