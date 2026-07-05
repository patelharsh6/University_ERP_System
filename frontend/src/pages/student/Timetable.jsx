// src/pages/student/Timetable.jsx
import React, { useState } from 'react';
import './Timetable.css';
import {
  FiChevronLeft, FiChevronRight, FiCheckCircle, FiClock,
  FiUser, FiMapPin, FiGrid, FiList, FiCalendar, FiBook
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SUBJECT_COLORS = {
  'CE601': { bg: '#eff6ff', border: '#2563eb', text: '#1d4ed8', dot: '#2563eb' },
  'CE602': { bg: '#f0fdf4', border: '#059669', text: '#065f46', dot: '#059669' },
  'CE603': { bg: '#fdf4ff', border: '#9333ea', text: '#6b21a8', dot: '#9333ea' },
  'CE604': { bg: '#fff7ed', border: '#ea580c', text: '#c2410c', dot: '#ea580c' },
  'CE605': { bg: '#f0f9ff', border: '#0284c7', text: '#075985', dot: '#0284c7' },
  'BREAK': { bg: '#f9fafb', border: '#d1d5db', text: '#9ca3af', dot: '#d1d5db' },
};

const weekSchedule = {
  Mon: [
    { id: 1, code: 'CE601', subject: 'Database Management Systems', time: '09:10–10:00', room: 'Room 304', faculty: 'Dr. Rajesh Sharma', type: 'Lecture',   duration: '50 min' },
    { id: 2, code: 'CE602', subject: 'Artificial Intelligence',       time: '10:00–10:50', room: 'Room 204', faculty: 'Prof. Anita Verma',  type: 'Lecture',   duration: '50 min' },
    { id: 3, code: 'BREAK', subject: 'Lunch Break',                   time: '10:50–11:40', room: '',         faculty: '',                   type: 'Break',     duration: '50 min' },
    { id: 4, code: 'CE603', subject: 'Computer Networks (Lab)',        time: '11:40–13:20', room: 'Network Lab 2', faculty: 'Dr. Sanjay Gupta', type: 'Practical', duration: '100 min' },
    { id: 5, code: 'CE604', subject: 'Software Engineering',           time: '14:00–14:50', room: 'Room 101', faculty: 'Prof. Meera Desai',  type: 'Lecture',   duration: '50 min' },
  ],
  Tue: [
    { id: 6, code: 'CE602', subject: 'Artificial Intelligence',        time: '09:10–10:00', room: 'Room 204', faculty: 'Prof. Anita Verma',  type: 'Lecture',   duration: '50 min' },
    { id: 7, code: 'CE604', subject: 'Software Engineering',            time: '10:00–10:50', room: 'Room 101', faculty: 'Prof. Meera Desai',  type: 'Lecture',   duration: '50 min' },
    { id: 8, code: 'CE605', subject: 'Web Technologies (Lab)',          time: '11:40–13:20', room: 'Web Lab 3', faculty: 'Dr. Priya Singh',   type: 'Practical', duration: '100 min' },
  ],
  Wed: [
    { id: 9,  code: 'CE601', subject: 'Database Management Systems',    time: '09:10–10:00', room: 'Room 304', faculty: 'Dr. Rajesh Sharma',  type: 'Lecture',  duration: '50 min' },
    { id: 10, code: 'CE603', subject: 'Computer Networks',              time: '10:00–10:50', room: 'Room 202', faculty: 'Dr. Sanjay Gupta',   type: 'Lecture',  duration: '50 min' },
    { id: 11, code: 'CE605', subject: 'Web Technologies',               time: '14:00–14:50', room: 'Room 305', faculty: 'Dr. Priya Singh',    type: 'Lecture',  duration: '50 min' },
  ],
  Thu: [
    { id: 12, code: 'CE604', subject: 'Software Engineering',           time: '09:10–10:00', room: 'Room 101', faculty: 'Prof. Meera Desai',  type: 'Lecture',   duration: '50 min' },
    { id: 13, code: 'CE601', subject: 'DBMS Lab',                       time: '10:00–11:40', room: 'DB Lab 1', faculty: 'Dr. Rajesh Sharma',  type: 'Practical', duration: '100 min' },
    { id: 14, code: 'CE602', subject: 'Artificial Intelligence',        time: '14:00–14:50', room: 'Room 204', faculty: 'Prof. Anita Verma',  type: 'Lecture',   duration: '50 min' },
  ],
  Fri: [
    { id: 15, code: 'CE603', subject: 'Computer Networks',              time: '09:10–10:00', room: 'Room 202', faculty: 'Dr. Sanjay Gupta',   type: 'Lecture',   duration: '50 min' },
    { id: 16, code: 'CE605', subject: 'Web Technologies',               time: '10:00–10:50', room: 'Room 305', faculty: 'Dr. Priya Singh',    type: 'Lecture',   duration: '50 min' },
    { id: 17, code: 'CE601', subject: 'Database Management Systems',    time: '11:40–12:30', room: 'Room 304', faculty: 'Dr. Rajesh Sharma',  type: 'Lecture',   duration: '50 min' },
  ],
  Sat: [
    { id: 18, code: 'CE602', subject: 'AI Lab',                         time: '09:10–11:40', room: 'AI Lab 4', faculty: 'Prof. Anita Verma',  type: 'Practical', duration: '150 min' },
  ],
};

// Today: Monday (index 0)
const TODAY_IDX = 0;

// All week dates (starting from Mon 05 Jan 2026)
const WEEK_DATES = ['05', '06', '07', '08', '09', '10'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const cardItem   = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

// ─── Component ────────────────────────────────────────────────────────────────
const Timetable = () => {
  const [activeDay, setActiveDay]     = useState(TODAY_IDX);
  const [view, setView]               = useState('day');  // 'day' | 'week'
  const [weekOffset, setWeekOffset]   = useState(0);

  const currentDayKey  = WEEK_DAYS[activeDay];
  const currentClasses = weekSchedule[currentDayKey] || [];
  const nonBreak       = currentClasses.filter(c => c.code !== 'BREAK');

  const totalClasses   = nonBreak.length;
  const lectureCount   = nonBreak.filter(c => c.type === 'Lecture').length;
  const practicalCount = nonBreak.filter(c => c.type === 'Practical').length;

  return (
    <motion.div className="tt-container" variants={container} initial="hidden" animate="show">

      {/* ── Page Header ── */}
      <motion.div className="tt-header" variants={cardItem}>
        <div className="tt-header-left">
          <h1>Timetable</h1>
          <span className="tt-sem-badge">SEMESTER-VI · 2025-26</span>
        </div>
        <div className="tt-view-toggle">
          <button
            className={`tt-toggle-btn ${view === 'day' ? 'active' : ''}`}
            onClick={() => setView('day')}
          >
            <FiList size={15} /> Day
          </button>
          <button
            className={`tt-toggle-btn ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            <FiGrid size={15} /> Week
          </button>
        </div>
      </motion.div>

      {/* ── Week Navigator ── */}
      <motion.div className="tt-week-nav" variants={cardItem}>
        <button className="tt-nav-arrow" onClick={() => setWeekOffset(w => w - 1)}>
          <FiChevronLeft />
        </button>
        <div className="tt-days-strip">
          {WEEK_DAYS.map((day, idx) => (
            <button
              key={day}
              className={`tt-day-pill ${activeDay === idx ? 'tt-day-active' : ''} ${idx === TODAY_IDX && weekOffset === 0 ? 'tt-day-today' : ''}`}
              onClick={() => setActiveDay(idx)}
            >
              <span className="tt-pill-day">{day}</span>
              <span className="tt-pill-date">{WEEK_DATES[idx]}</span>
              {weekSchedule[day]?.filter(c => c.code !== 'BREAK').length > 0 && (
                <span className="tt-pill-dot" />
              )}
              {activeDay === idx && <motion.div className="tt-day-indicator" layoutId="tt-day-ind" />}
            </button>
          ))}
        </div>
        <button className="tt-nav-arrow" onClick={() => setWeekOffset(w => w + 1)}>
          <FiChevronRight />
        </button>
      </motion.div>

      {/* ── Day Stats ── */}
      <motion.div className="tt-day-stats" variants={cardItem}>
        <div className="tt-stat-chip">
          <FiCalendar size={13} />
          <span>{totalClasses} Classes</span>
        </div>
        <div className="tt-stat-chip chip-lecture">
          <FiBook size={13} />
          <span>{lectureCount} Lectures</span>
        </div>
        <div className="tt-stat-chip chip-practical">
          <FiGrid size={13} />
          <span>{practicalCount} Practicals</span>
        </div>
        <div className="tt-stat-chip chip-day">
          <FiCalendar size={13} />
          <span>{FULL_DAYS[activeDay]}, {WEEK_DATES[activeDay]} Jan 2026</span>
        </div>
      </motion.div>

      {/* ── View: Day ── */}
      <AnimatePresence mode="wait">
        {view === 'day' && (
          <motion.div
            key="day-view"
            className="tt-day-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {currentClasses.length === 0 ? (
              <div className="tt-empty">
                <FiCalendar size={40} />
                <p>No classes scheduled for {FULL_DAYS[activeDay]}</p>
              </div>
            ) : (
              <div className="tt-class-list">
                {currentClasses.map((cls, idx) => {
                  const color = SUBJECT_COLORS[cls.code] || SUBJECT_COLORS['CE601'];
                  const isLive = activeDay === TODAY_IDX && idx === 2 && weekOffset === 0;

                  if (cls.code === 'BREAK') {
                    return (
                      <div key={cls.id} className="tt-break-row">
                        <span className="tt-break-time">{cls.time}</span>
                        <span className="tt-break-label">— Lunch Break —</span>
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={cls.id}
                      className={`tt-class-card ${isLive ? 'tt-card-live' : ''}`}
                      style={{
                        '--cls-bg': color.bg,
                        '--cls-border': color.border,
                        '--cls-text': color.text,
                        '--cls-dot': color.dot,
                      }}
                      variants={cardItem}
                      whileHover={{ y: -2, boxShadow: `0 8px 24px rgba(0,0,0,0.1)` }}
                    >
                      {/* Time stripe */}
                      <div className="tt-card-time-col">
                        <div className="tt-card-dot" />
                        <span className="tt-card-time">{cls.time.split('–')[0]}</span>
                        <div className="tt-card-vline" />
                        <span className="tt-card-time tt-end-time">{cls.time.split('–')[1]}</span>
                      </div>

                      {/* Main content */}
                      <div className="tt-card-body">
                        <div className="tt-card-top">
                          <div>
                            <span className="tt-card-code" style={{ color: color.text }}>{cls.code}</span>
                            <h3 className="tt-card-subject">{cls.subject}</h3>
                          </div>
                          <div className="tt-card-badges">
                            <span className={`tt-type-badge ${cls.type === 'Practical' ? 'tt-type-practical' : 'tt-type-lecture'}`}>
                              {cls.type}
                            </span>
                            {isLive && <span className="tt-live-badge"><span className="tt-live-blink"/>Live</span>}
                          </div>
                        </div>

                        <div className="tt-card-meta">
                          <span className="tt-meta-item">
                            <FiClock size={12} /> {cls.duration}
                          </span>
                          <span className="tt-meta-item">
                            <FiMapPin size={12} /> {cls.room}
                          </span>
                          <span className="tt-meta-item">
                            <FiUser size={12} /> {cls.faculty}
                          </span>
                        </div>
                      </div>

                      {/* Right status */}
                      <div className="tt-card-status">
                        {idx < 2 && activeDay === TODAY_IDX && weekOffset === 0 && (
                          <div className="tt-done-badge">
                            <FiCheckCircle size={14} />
                            <span>Done</span>
                          </div>
                        )}
                        {isLive && (
                          <div className="tt-progress-ring">
                            <svg width="44" height="44" viewBox="0 0 44 44">
                              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="4"/>
                              <circle cx="22" cy="22" r="18" fill="none" stroke="#ef4444" strokeWidth="4"
                                strokeDasharray="113" strokeDashoffset="42"
                                strokeLinecap="round" transform="rotate(-90 22 22)"/>
                            </svg>
                            <span className="tt-progress-label">63%</span>
                          </div>
                        )}
                        {idx > 2 && activeDay === TODAY_IDX && weekOffset === 0 && (
                          <div className="tt-upcoming-badge">
                            <FiClock size={14} />
                            <span>Soon</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── View: Week ── */}
        {view === 'week' && (
          <motion.div
            key="week-view"
            className="tt-week-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tt-week-grid">
              {WEEK_DAYS.map((day, dIdx) => {
                const classes = (weekSchedule[day] || []).filter(c => c.code !== 'BREAK');
                return (
                  <div
                    key={day}
                    className={`tt-week-col ${dIdx === TODAY_IDX && weekOffset === 0 ? 'tt-week-col-today' : ''}`}
                    onClick={() => { setActiveDay(dIdx); setView('day'); }}
                  >
                    <div className="tt-week-col-head">
                      <span className="tt-week-col-day">{day}</span>
                      <span className="tt-week-col-date">{WEEK_DATES[dIdx]}</span>
                      {dIdx === TODAY_IDX && weekOffset === 0 && (
                        <span className="tt-week-today-pill">Today</span>
                      )}
                    </div>
                    <div className="tt-week-col-body">
                      {classes.length === 0 ? (
                        <div className="tt-week-empty-col">Free day</div>
                      ) : (
                        classes.map((cls) => {
                          const color = SUBJECT_COLORS[cls.code] || SUBJECT_COLORS['CE601'];
                          return (
                            <div
                              key={cls.id}
                              className="tt-week-chip"
                              style={{ background: color.bg, borderLeft: `3px solid ${color.border}` }}
                            >
                              <span className="tt-week-chip-code" style={{ color: color.text }}>{cls.code}</span>
                              <span className="tt-week-chip-time">{cls.time}</span>
                              <span className={`tt-week-chip-type ${cls.type === 'Practical' ? 'wct-practical' : 'wct-lecture'}`}>
                                {cls.type === 'Practical' ? 'Lab' : 'Lec'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Timetable;