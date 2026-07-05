// src/pages/student/Dashboard.jsx
import React, { useState } from 'react';
import './Dashboard.css';
import {
  FiCheckSquare, FiAward, FiCreditCard, FiCalendar,
  FiBookOpen, FiArrowRight, FiTrendingUp, FiBell,
  FiClock, FiMapPin, FiUser, FiAlertCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const student = {
  name: 'Harsh Patel',
  firstName: 'Harsh',
  rollNo: '22CE001',
  semester: 'Semester VI',
  course: 'B.Tech CSE (AI-ML)',
  college: 'Adani University',
  status: 'Active',
  avatarSeed: 'harsh',
  admissionNo: '2026/CE/042',
};

const kpis = [
  { label: 'Attendance',   value: '82%',  sub: '260/316 periods',    icon: FiCheckSquare, color: '#2563eb', bg: 'rgba(37,99,235,0.1)',   path: '/s/attendance' },
  { label: 'CGPA',         value: '8.60', sub: 'Current Semester',    icon: FiAward,       color: '#0d9488', bg: 'rgba(13,148,136,0.1)',  path: '/s/results' },
  { label: 'Due Fees',     value: '₹0',   sub: 'No pending dues',     icon: FiCreditCard,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  path: '/s/billing' },
  { label: "Today's Class",value: '4',    sub: 'Next at 11:00 AM',    icon: FiCalendar,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  path: '/s/timetable' },
];

const todaySchedule = [
  { id: 1, code: 'CE601', subject: 'Database Mgmt. Systems', time: '09:10 – 10:00', room: 'Room 304', faculty: 'Dr. Rajesh Sharma',  type: 'Lecture',   status: 'done' },
  { id: 2, code: 'CE602', subject: 'Artificial Intelligence',  time: '10:00 – 10:50', room: 'Room 204', faculty: 'Prof. Anita Verma', type: 'Lecture',   status: 'done' },
  { id: 3, code: 'CE603', subject: 'Computer Networks (Lab)',   time: '11:00 – 12:40', room: 'Network Lab 2', faculty: 'Dr. Sanjay Gupta', type: 'Practical', status: 'live' },
  { id: 4, code: 'CE604', subject: 'Software Engineering',     time: '01:30 – 02:20', room: 'Room 101', faculty: 'Prof. Meera Desai', type: 'Lecture',   status: 'upcoming' },
];

const announcements = [
  { id: 1, title: 'Mid-Semester Exams Schedule Released',         time: '2h ago',    tag: 'Exam',      urgent: true  },
  { id: 2, title: 'Library Book Return Deadline – 25 Jan 2026',  time: '5h ago',    tag: 'Library',   urgent: false },
  { id: 3, title: 'Guest Lecture: AI in Healthcare – 24 Jan 3PM',time: 'Yesterday', tag: 'Event',     urgent: false },
];

const subjectAttendance = [
  { subject: 'DBMS',  pct: 95, fill: '#2563eb' },
  { subject: 'AI',    pct: 88, fill: '#0d9488' },
  { subject: 'CN',    pct: 81, fill: '#8b5cf6' },
  { subject: 'SE',    pct: 80, fill: '#f59e0b' },
  { subject: 'IoT',   pct: 71, fill: '#ef4444' },
];

const quickLinks = [
  { label: 'Results',        icon: FiAward,      path: '/s/results',       color: '#0d9488' },
  { label: 'Materials',      icon: FiBookOpen,   path: '/s/materials',     color: '#8b5cf6' },
  { label: 'Timetable',      icon: FiCalendar,   path: '/s/timetable',     color: '#2563eb' },
  { label: 'Announcements',  icon: FiBell,       path: '/s/announcements', color: '#f59e0b' },
];

// ─── Animation ────────────────────────────────────────────────────────────────
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

// ─── Component ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const radialData = subjectAttendance.map(s => ({ name: s.subject, value: s.pct, fill: s.fill }));

  return (
    <motion.div className="db-container" variants={container} initial="hidden" animate="show">

      {/* ── Hero Banner ── */}
      <motion.div className="db-hero" variants={item}>
        <div className="db-hero-left">
          <p className="db-greeting">{greeting} 👋</p>
          <h1 className="db-name">{student.firstName}</h1>
          <p className="db-course">{student.course} · {student.semester}</p>
          <div className="db-hero-badges">
            <span className="db-badge badge-active">
              <span className="db-badge-dot" /> {student.status}
            </span>
            <span className="db-badge badge-roll">{student.rollNo}</span>
            <span className="db-badge badge-roll">{student.college}</span>
          </div>
        </div>
        <div className="db-hero-right">
          <div className="db-avatar-ring">
            <img
              src={`https://i.pravatar.cc/200?u=${student.avatarSeed}`}
              alt={student.name}
              className="db-avatar"
            />
          </div>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div className="db-kpi-grid" variants={item}>
        {kpis.map((k) => (
          <div
            key={k.label}
            className="db-kpi-card"
            onClick={() => navigate(k.path)}
            style={{ '--kpi-color': k.color, '--kpi-bg': k.bg }}
          >
            <div className="db-kpi-icon-wrap">
              <k.icon size={20} />
            </div>
            <div className="db-kpi-body">
              <div className="db-kpi-value">{k.value}</div>
              <div className="db-kpi-label">{k.label}</div>
              <div className="db-kpi-sub">{k.sub}</div>
            </div>
            <FiArrowRight className="db-kpi-arrow" size={16} />
          </div>
        ))}
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="db-main-grid">

        {/* LEFT COLUMN */}
        <div className="db-col-left">

          {/* Today's Schedule */}
          <motion.div className="db-card" variants={item}>
            <div className="db-card-head">
              <div className="db-card-title-row">
                <FiCalendar className="db-card-icon" />
                <h2>Today's Schedule</h2>
              </div>
              <button className="db-see-all" onClick={() => navigate('/s/timetable')}>
                View all <FiArrowRight size={13} />
              </button>
            </div>

            <div className="db-schedule-list">
              {todaySchedule.map((cls) => (
                <div key={cls.id} className={`db-schedule-row db-sched-${cls.status}`}>
                  <div className="db-sched-time-col">
                    <span className="db-sched-time">{cls.time}</span>
                    {cls.status === 'live' && <span className="db-live-dot" />}
                  </div>
                  <div className="db-sched-divider">
                    <div className="db-sched-line" />
                    <div className="db-sched-circle" />
                  </div>
                  <div className="db-sched-info">
                    <div className="db-sched-subject">{cls.subject}</div>
                    <div className="db-sched-meta">
                      <span><FiMapPin size={11} /> {cls.room}</span>
                      <span><FiUser size={11} /> {cls.faculty}</span>
                    </div>
                    <span className={`db-sched-badge db-type-${cls.type.toLowerCase()}`}>{cls.type}</span>
                  </div>
                  <div className="db-sched-status">
                    {cls.status === 'done'     && <span className="db-status done">✓ Done</span>}
                    {cls.status === 'live'     && <span className="db-status live">● Live</span>}
                    {cls.status === 'upcoming' && <span className="db-status upcoming"><FiClock size={11} /> Soon</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div className="db-card" variants={item}>
            <div className="db-card-head">
              <div className="db-card-title-row">
                <FiBell className="db-card-icon" />
                <h2>Announcements</h2>
              </div>
              <button className="db-see-all" onClick={() => navigate('/s/announcements')}>
                View all <FiArrowRight size={13} />
              </button>
            </div>
            <div className="db-announcements-list">
              {announcements.map((ann) => (
                <div key={ann.id} className={`db-ann-row ${ann.urgent ? 'db-ann-urgent' : ''}`}>
                  <div className="db-ann-left">
                    {ann.urgent
                      ? <FiAlertCircle className="db-ann-alert-icon" size={16} />
                      : <FiBell className="db-ann-bell-icon" size={16} />
                    }
                  </div>
                  <div className="db-ann-body">
                    <p className="db-ann-title">{ann.title}</p>
                    <div className="db-ann-meta">
                      <span className="db-ann-tag">{ann.tag}</span>
                      <span className="db-ann-time">{ann.time}</span>
                    </div>
                  </div>
                  <FiArrowRight size={14} className="db-ann-arrow" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="db-col-right">

          {/* Attendance Radial */}
          <motion.div className="db-card" variants={item}>
            <div className="db-card-head">
              <div className="db-card-title-row">
                <FiTrendingUp className="db-card-icon" />
                <h2>Attendance Overview</h2>
              </div>
              <button className="db-see-all" onClick={() => navigate('/s/attendance')}>
                Details <FiArrowRight size={13} />
              </button>
            </div>

            <div className="db-radial-wrap">
              <ResponsiveContainer width="100%" height={190}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={85}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'var(--card-border)' }} />
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="db-radial-center">
                <span className="db-radial-main">82%</span>
                <span className="db-radial-sub">Overall</span>
              </div>
            </div>

            <div className="db-subject-legends">
              {subjectAttendance.map((s) => (
                <div key={s.subject} className="db-legend-row">
                  <div className="db-legend-dot" style={{ background: s.fill }} />
                  <span className="db-legend-name">{s.subject}</span>
                  <div className="db-legend-bar-wrap">
                    <div className="db-legend-bar">
                      <div className="db-legend-fill" style={{ width: `${s.pct}%`, background: s.fill }} />
                    </div>
                  </div>
                  <span className="db-legend-pct" style={{ color: s.pct >= 75 ? s.fill : '#ef4444' }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="db-card" variants={item}>
            <div className="db-card-head">
              <div className="db-card-title-row">
                <FiBookOpen className="db-card-icon" />
                <h2>Quick Access</h2>
              </div>
            </div>
            <div className="db-quick-grid">
              {quickLinks.map((ql) => (
                <button
                  key={ql.label}
                  className="db-quick-btn"
                  onClick={() => navigate(ql.path)}
                  style={{ '--ql-color': ql.color }}
                >
                  <div className="db-quick-icon">
                    <ql.icon size={20} />
                  </div>
                  <span>{ql.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;