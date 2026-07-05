// src/pages/student/Holidays.jsx
import React, { useState } from 'react';
import './Holidays.css';
import {
  FiSun, FiCalendar, FiChevronLeft, FiChevronRight,
  FiStar, FiGrid, FiList, FiInfo, FiGift
} from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const holidaysData = [
  // January
  { id: 1,  date: '2026-01-01', name: 'New Year\'s Day',             type: 'National',   month: 'January',   icon: '🎆', optional: false },
  { id: 2,  date: '2026-01-14', name: 'Makar Sankranti / Uttarayan', type: 'Festival',   month: 'January',   icon: '🪁', optional: false },
  { id: 3,  date: '2026-01-26', name: 'Republic Day',                type: 'National',   month: 'January',   icon: '🇮🇳', optional: false },
  // February
  { id: 4,  date: '2026-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti', type: 'State', month: 'February', icon: '⚔️', optional: false },
  // March
  { id: 5,  date: '2026-03-05', name: 'Holi',                        type: 'Festival',   month: 'March',     icon: '🌈', optional: false },
  { id: 6,  date: '2026-03-06', name: 'Dhuleti (Holi 2nd day)',       type: 'Festival',   month: 'March',     icon: '🌈', optional: true  },
  { id: 7,  date: '2026-03-20', name: 'Gudi Padwa',                   type: 'Festival',   month: 'March',     icon: '🏮', optional: false },
  { id: 8,  date: '2026-03-30', name: 'Ram Navami',                   type: 'Festival',   month: 'March',     icon: '🙏', optional: false },
  // April
  { id: 9,  date: '2026-04-01', name: 'Ugadi / Gudi Padwa',           type: 'Festival',   month: 'April',     icon: '🎋', optional: false },
  { id: 10, date: '2026-04-03', name: 'Good Friday',                  type: 'National',   month: 'April',     icon: '✝️', optional: false },
  { id: 11, date: '2026-04-14', name: 'Dr. Ambedkar Jayanti',         type: 'National',   month: 'April',     icon: '📖', optional: false },
  // May
  { id: 12, date: '2026-05-01', name: 'Labour Day / Gujarat Day',     type: 'State',      month: 'May',       icon: '🛠️', optional: false },
  { id: 13, date: '2026-05-27', name: 'Buddha Purnima',               type: 'National',   month: 'May',       icon: '☸️', optional: false },
  // June
  { id: 14, date: '2026-06-27', name: 'Eid ul-Adha (Bakrid)',         type: 'Festival',   month: 'June',      icon: '🌙', optional: false },
  // July
  { id: 15, date: '2026-07-01', name: 'Muharram',                     type: 'Festival',   month: 'July',      icon: '🌙', optional: false },
  // August
  { id: 16, date: '2026-08-15', name: 'Independence Day',             type: 'National',   month: 'August',    icon: '🇮🇳', optional: false },
  { id: 17, date: '2026-08-25', name: 'Janmashtami',                  type: 'Festival',   month: 'August',    icon: '🦚', optional: false },
  // September
  { id: 18, date: '2026-09-04', name: 'Ganesh Chaturthi',             type: 'Festival',   month: 'September', icon: '🐘', optional: false },
  { id: 19, date: '2026-09-14', name: 'Onam',                         type: 'Festival',   month: 'September', icon: '🌸', optional: true  },
  // October
  { id: 20, date: '2026-10-02', name: 'Gandhi Jayanti',               type: 'National',   month: 'October',   icon: '🕊️', optional: false },
  { id: 21, date: '2026-10-22', name: 'Navratri Begins',              type: 'Festival',   month: 'October',   icon: '💃', optional: false },
  { id: 22, date: '2026-10-29', name: 'Dussehra (Vijayadashami)',      type: 'Festival',   month: 'October',   icon: '🏹', optional: false },
  // November
  { id: 23, date: '2026-11-05', name: 'Diwali (Lakshmi Puja)',        type: 'Festival',   month: 'November',  icon: '🪔', optional: false },
  { id: 24, date: '2026-11-06', name: 'Govardhan Puja',               type: 'Festival',   month: 'November',  icon: '🪔', optional: false },
  { id: 25, date: '2026-11-07', name: 'Bhai Dooj',                    type: 'Festival',   month: 'November',  icon: '👫', optional: false },
  { id: 26, date: '2026-11-15', name: 'Guru Nanak Jayanti',           type: 'National',   month: 'November',  icon: '🙏', optional: false },
  // December
  { id: 27, date: '2026-12-25', name: 'Christmas Day',                type: 'National',   month: 'December',  icon: '🎄', optional: false },
  // University Specific
  { id: 28, date: '2026-01-11', name: 'University Foundation Day',    type: 'University', month: 'January',   icon: '🏛️', optional: false },
  { id: 29, date: '2026-03-15', name: 'Mid-Semester Break Begins',    type: 'University', month: 'March',     icon: '📚', optional: false },
  { id: 30, date: '2026-03-22', name: 'Mid-Semester Break Ends',      type: 'University', month: 'March',     icon: '📚', optional: false },
  { id: 31, date: '2026-07-14', name: 'Summer Vacation Begins',       type: 'University', month: 'July',      icon: '☀️', optional: false },
  { id: 32, date: '2026-08-03', name: 'Monsoon Semester Begins',      type: 'University', month: 'August',    icon: '🌧️', optional: false },
];

const MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const TYPE_CONFIG = {
  National:   { color: '#2563eb', bg: 'rgba(37,99,235,0.1)'  },
  Festival:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  State:      { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  University: { color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
};

const MONTH_NUMS = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return 'Today!';
  if (diff === 1) return 'Tomorrow!';
  if (diff <= 7) return `In ${diff} days`;
  if (diff <= 30) return `In ${diff} days`;
  return null;
}

function getDayOfWeek(dateStr) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateStr).getDay()];
}

// ─── Main Component ────────────────────────────────────────────────────────────
const Holidays = () => {
  const [activeMonth, setActiveMonth] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'

  const types = ['All', 'National', 'Festival', 'State', 'University'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = holidaysData
    .filter(h => {
      const matchMonth = activeMonth === 'All' || h.month === activeMonth;
      const matchType  = activeType  === 'All' || h.type  === activeType;
      return matchMonth && matchType;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = holidaysData
    .filter(h => new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 1)[0];

  const totalThisYear = holidaysData.length;
  const totalNational = holidaysData.filter(h => h.type === 'National').length;
  const totalFestival = holidaysData.filter(h => h.type === 'Festival').length;

  // Group by month for list view
  const grouped = filtered.reduce((acc, h) => {
    if (!acc[h.month]) acc[h.month] = [];
    acc[h.month].push(h);
    return acc;
  }, {});

  return (
    <div className="holidays-page">

      {/* ── HEADER ── */}
      <div className="holidays-header">
        <div className="holidays-title-group">
          <div className="holidays-icon"><FiSun size={22} /></div>
          <div>
            <h1 className="holidays-title">Holidays 2026</h1>
            <p className="holidays-sub">Academic Year · Adani University</p>
          </div>
        </div>
      </div>

      {/* ── NEXT HOLIDAY BANNER ── */}
      {upcoming && (
        <div className="next-holiday-banner">
          <div className="nhb-emoji">{upcoming.icon}</div>
          <div className="nhb-info">
            <span className="nhb-label">Next Holiday</span>
            <strong className="nhb-name">{upcoming.name}</strong>
            <span className="nhb-date">{new Date(upcoming.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {getDayOfWeek(upcoming.date)}</span>
          </div>
          <div className="nhb-countdown">
            {getDaysUntil(upcoming.date) && (
              <span className="nhb-days">{getDaysUntil(upcoming.date)}</span>
            )}
          </div>
        </div>
      )}

      {/* ── KPI STRIP ── */}
      <div className="holidays-kpi-strip">
        <div className="hol-kpi">
          <span className="hol-kpi-val">{totalThisYear}</span>
          <span className="hol-kpi-label">Total Holidays</span>
        </div>
        <div className="hol-kpi">
          <span className="hol-kpi-val">{totalNational}</span>
          <span className="hol-kpi-label">National</span>
        </div>
        <div className="hol-kpi">
          <span className="hol-kpi-val">{totalFestival}</span>
          <span className="hol-kpi-label">Festivals</span>
        </div>
        <div className="hol-kpi">
          <span className="hol-kpi-val">{holidaysData.filter(h => !h.optional).length}</span>
          <span className="hol-kpi-label">Gazetted</span>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="holidays-controls">
        {/* Month scroll */}
        <div className="month-scroll">
          {MONTHS.map(m => (
            <button
              key={m}
              className={`month-chip ${activeMonth === m ? 'active' : ''}`}
              onClick={() => setActiveMonth(m)}
            >
              {m === 'All' ? 'All Months' : m.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Type filters */}
        <div className="type-filter-row">
          {types.map(t => {
            const cfg = TYPE_CONFIG[t];
            return (
              <button
                key={t}
                className={`type-chip ${activeType === t ? 'active' : ''}`}
                style={activeType === t && cfg ? { background: cfg.color, borderColor: cfg.color, color: '#fff' } : {}}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── HOLIDAY LIST ── */}
      <div className="holidays-list">
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="holiday-month-group">
            <div className="holiday-month-label">
              <FiCalendar size={13} /> {month} <span className="month-count">{items.length}</span>
            </div>
            <div className="holiday-items">
              {items.map(h => {
                const cfg = TYPE_CONFIG[h.type];
                const isPast = new Date(h.date) < today;
                const daysUntil = getDaysUntil(h.date);
                const dayOfWeek = getDayOfWeek(h.date);
                const dateObj = new Date(h.date);

                return (
                  <div key={h.id} className={`holiday-item ${isPast ? 'past' : ''}`}>
                    {/* Date Box */}
                    <div className="holiday-date-box" style={{ borderColor: cfg?.color, opacity: isPast ? 0.5 : 1 }}>
                      <span className="hdb-month">{dateObj.toLocaleString('en', { month: 'short' })}</span>
                      <span className="hdb-day" style={{ color: cfg?.color }}>{dateObj.getDate()}</span>
                      <span className="hdb-weekday">{dayOfWeek.slice(0, 3)}</span>
                    </div>

                    {/* Info */}
                    <div className="holiday-info">
                      <div className="holiday-name-row">
                        <span className="holiday-emoji">{h.icon}</span>
                        <h3 className="holiday-name" style={isPast ? { opacity: 0.6 } : {}}>{h.name}</h3>
                        {h.optional && <span className="optional-tag">Optional</span>}
                        {daysUntil && <span className="upcoming-tag" style={{ background: cfg?.bg, color: cfg?.color }}>{daysUntil}</span>}
                      </div>
                      <div className="holiday-meta-row">
                        <span
                          className="holiday-type-pill"
                          style={{ background: cfg?.bg, color: cfg?.color }}
                        >
                          {h.type}
                        </span>
                        {isPast && <span className="past-tag">Passed</span>}
                      </div>
                    </div>

                    {/* Star for upcoming */}
                    {!isPast && (
                      <div className="holiday-star">
                        <FiGift size={16} style={{ color: cfg?.color, opacity: 0.6 }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="holidays-empty">
            <FiSun size={40} />
            <p>No holidays found for the selected filter</p>
          </div>
        )}
      </div>

      {/* ── LEGEND ── */}
      <div className="holidays-legend">
        <span className="legend-title">Legend:</span>
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="legend-item">
            <span className="legend-dot" style={{ background: cfg.color }} />
            {type}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Holidays;
