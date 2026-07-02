// src/pages/faculty/FacultyDashboard.jsx
import React from 'react';
import './FacultyDashboard.css';
import { 
  FaQrcode, FaPlus, FaBullhorn, FaBook, FaUsers, FaClock, 
  FaCheckDouble, FaExclamationTriangle, FaChartBar, FaMagic, 
  FaUserGraduate, FaTasks 
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import { motion } from 'framer-motion';

// UI Components
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import KPI from '../../components/ui/KPI';

const PremiumTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  const val = formatter ? formatter(payload[0].value) : payload[0].value;
  return (
    <div style={{
      background: 'var(--surface-color)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 0' }}>{val}</p>
    </div>
  );
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const FacultyDashboard = () => {
  // --- MOCK DATA ---
  const facultyName = "Prof. Arvind Sharma";
  const department = "Computer Science Engineering";

  const stats = [
    { label: "Courses Assigned", value: "4", icon: <FaBook />, color: "icon-blue" },
    { label: "Total Students", value: "245", icon: <FaUsers />, color: "icon-purple" },
    { label: "Pending Grading", value: "32", icon: <FaCheckDouble />, color: "icon-orange" },
    { label: "Avg Attendance", value: "88%", icon: <FaUserGraduate />, color: "icon-green" },
  ];

  const todaysClasses = [
    { id: 1, time: "10:00 AM", subject: "Data Structures", room: "Lab 3", students: 60, status: "completed" },
    { id: 2, time: "12:00 PM", subject: "Database Mgmt (DBMS)", room: "Room 204", students: 55, status: "active" }, // Active
    { id: 3, time: "02:00 PM", subject: "Algorithms", room: "Hall B", students: 130, status: "upcoming" },
  ];

  const pendingGrading = [
    { id: 1, course: "Data Structures", task: "Assignment 2: Linked Lists", pending: 15 },
    { id: 2, course: "DBMS", task: "Mid-Term Project Phase 1", pending: 17 },
  ];

  const performanceData = [
    { name: 'CS101', avgMarks: 82 },
    { name: 'CS102', avgMarks: 76 },
    { name: 'CS201', avgMarks: 88 },
    { name: 'CS305', avgMarks: 71 },
  ];

  const axisStyle = { fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-family)' };

  return (
    <motion.div className="fac-dashboard-container" variants={containerVariants} initial="hidden" animate="show">
      
      {/* 🟦 1. HEADER & QUICK ACTIONS */}
      <motion.div className="fac-header" variants={itemVariants}>
        <div className="fac-welcome">
          <h1>Good Morning, {facultyName} 👋</h1>
          <p>{department} | Faculty Portal</p>
        </div>
        <div className="fac-quick-actions">
          <Button icon={<FaQrcode />} variant="primary">Start Attendance</Button>
          <Button icon={<FaPlus />} variant="secondary">Create Assignment</Button>
          <Button icon={<FaBullhorn />} variant="secondary">Post Notice</Button>
        </div>
      </motion.div>

      {/* 🟩 2. SUMMARY STATS */}
      <motion.div className="fac-stats-grid" variants={itemVariants}>
        {stats.map((stat, index) => (
          <KPI 
            key={index}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconBgClass={stat.color}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* 🟨 3. MAIN GRID */}
      <div className="fac-main-grid">
        
        {/* LEFT COLUMN (70%) */}
        <motion.div className="fac-col-left" variants={itemVariants}>
          
          {/* Today's Schedule */}
          <div className="fac-section">
            <div className="fac-section-header">
              <h2 className="fac-section-title"><FaClock color="var(--primary)" /> Today's Schedule</h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: '600' }}>12 Feb 2026</span>
            </div>
            
            <div>
              {todaysClasses.map(cls => (
                <Card key={cls.id} className={`fac-class-card ${cls.status}`}>
                  <div className="fac-class-info">
                    <h4>{cls.subject}</h4>
                    <div className="fac-class-meta">
                      <span>{cls.time}</span>
                      <span>•</span>
                      <span>{cls.room}</span>
                      <span>•</span>
                      <span>{cls.students} Students</span>
                    </div>
                  </div>
                  <div>
                    {cls.status === 'active' && (
                      <Button icon={<FaQrcode />} variant="primary" className="pulse-btn">
                        Accept Attendance
                      </Button>
                    )}
                    {cls.status === 'completed' && <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Recorded</span>}
                    {cls.status === 'upcoming' && <span style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Upcoming</span>}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Pending Grading */}
          <div className="fac-section">
            <div className="fac-section-header">
              <h2 className="fac-section-title"><FaTasks color="#8B5CF6" /> Pending Evaluations</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div>
              {pendingGrading.map(task => (
                <Card key={task.id} className="grading-item">
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: 'var(--text-base)', fontWeight: '600' }}>{task.task}</h4>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{task.course}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Badge variant="warning">{task.pending} Pending</Badge>
                    <Button variant="secondary" size="sm">Grade Now</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </motion.div>

        {/* RIGHT COLUMN (30%) */}
        <motion.div className="fac-col-right" variants={itemVariants}>
          
          {/* AI Insights Panel (Premium Feature) */}
          <Card title="AI Class Insights" icon={<FaMagic color="var(--primary)" />}>
            <div className="insight-text" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>CS102 (DBMS)</strong> is showing a 15% drop in assignment submissions this week. Consider extending the deadline or reviewing Chapter 3.
            </div>
          </Card>

          {/* Alerts Section */}
          <div className="fac-section" style={{ marginTop: '24px' }}>
            <h2 className="fac-section-title" style={{ marginBottom: '16px' }}><FaExclamationTriangle color="var(--danger)" /> Action Required</h2>
            
            <Card className="alert-item" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--danger)' }}><FaExclamationTriangle /></div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--text-sm)' }}>Low Attendance Alert</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>12 students in CS101 have fallen below 75% attendance.</p>
                </div>
              </div>
            </Card>
            <Card className="alert-item">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--warning)' }}><FaExclamationTriangle /></div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--text-sm)' }}>Missing Submissions</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>5 students haven't submitted Lab Report 2 (Past Due).</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Snapshot */}
          <div className="fac-section" style={{ marginTop: '24px' }}>
            <h2 className="fac-section-title" style={{ marginBottom: '16px' }}><FaChartBar color="var(--success)" /> Avg Class Marks</h2>
            <Card>
              <div style={{ height: '180px', width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={performanceData}>
                    <defs>
                      <linearGradient id="facBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisStyle} dy={10} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip content={<PremiumTooltip formatter={(v) => `${v}%`} />} cursor={{ fill: 'var(--hover-bg)' }} />
                    <Bar dataKey="avgMarks" fill="url(#facBarGrad)" radius={[4, 4, 0, 0]} maxBarSize={38} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default FacultyDashboard;