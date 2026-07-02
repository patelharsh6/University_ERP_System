// src/pages/student/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import { 
  FiUser, FiCalendar, FiCreditCard, FiTrendingUp, 
  FiMaximize, FiCheckCircle, FiAlertTriangle, FiBookOpen, FiPlus,
  FiArrowUp, FiArrowDown, FiEdit3, FiAward, FiRadio, FiClock,
  FiCpu, FiTarget
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import FacultyDashboard from '../faculty/FacultyDashboard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// UI Components
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import KPI from '../../components/ui/KPI';
import Table from '../../components/ui/Table';

/* ─────────────── Custom Recharts Tooltip ─────────────── */
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

const Dashboard = ({ userRole }) => {
  
  // --- STUDENT MOCK DATA ---
  const studentName = "Harsh Patel";
  
  const studentStats = [
    { title: "Attendance", value: "92%", icon: <FiCalendar />, color: "icon-green", sub: "Goal achieved" },
    { title: "CGPA", value: "8.7", icon: <FiAward />, color: "icon-purple", sub: "Top 10%" },
    { title: "Pending Assignments", value: "3", icon: <FiEdit3 />, color: "icon-orange", sub: "Due this week" },
    { title: "Outstanding Fees", value: "₹5,000", icon: <FiCreditCard />, color: "icon-blue", sub: "Due 15 Mar" },
  ];

  const upcomingClasses = [
    { id: 1, subject: "DBMS", time: "10:00 AM", faculty: "Prof. Sharma", room: "Lab 3" },
    { id: 2, subject: "AI", time: "11:00 AM", faculty: "Prof. Verma", room: "Room 204" },
    { id: 3, subject: "CN", time: "01:00 PM", faculty: "Prof. Gupta", room: "Hall B" },
  ];

  const recentResults = [
    { id: 1, subject: "DBMS", marks: 85, total: 100 },
    { id: 2, subject: "OS", marks: 82, total: 100 },
    { id: 3, subject: "AI", marks: 90, total: 100 },
  ];

  const announcements = [
    { id: 1, title: "Exam Schedule Released", date: "Today", type: "urgent" },
    { id: 2, title: "Holiday Notice", date: "Yesterday", type: "general" },
    { id: 3, title: "Project Submission Deadline", date: "10 Feb", type: "important" },
  ];

  // --- ADMIN MOCK DATA ---
  const currentDate = "Mon, 08 Jun 2026";
  const adminStats = [
    { title: "Total Students", value: "12,500", icon: <FiUser />, color: "icon-purple", sub: "+4% from last sem", trend: "up" },
    { title: "Attendance Rate", value: "92%", icon: <FiCalendar />, color: "icon-green", sub: "Goal: >90%", trend: "up" },
    { title: "Revenue", value: "₹45,00,000", icon: <FiCreditCard />, color: "icon-blue", sub: "Outstanding: ₹8.4L", trend: "up" },
    { title: "Courses Offered", value: "48", icon: <FiBookOpen />, color: "icon-orange", sub: "6 departments", trend: "neutral" },
  ];

  const attendanceTrendsData = [
    { month: 'Jan', rate: 94 }, { month: 'Feb', rate: 92 }, { month: 'Mar', rate: 95 },
    { month: 'Apr', rate: 93 }, { month: 'May', rate: 91 }, { month: 'Jun', rate: 92 },
  ];

  const revenueAnalyticsData = [
    { month: 'Jan', collected: 1200000 }, { month: 'Feb', collected: 1800000 }, { month: 'Mar', collected: 1500000 },
    { month: 'Apr', collected: 900000 }, { month: 'May', collected: 2100000 }, { month: 'Jun', collected: 4500000 },
  ];

  const recentStudentsData = [
    { id: 1, name: "Aarav Mehta", course: "B.Tech CSE", fee: "₹1,20,000", status: "active", avatar: "#2563EB" },
    { id: 2, name: "Priya Sharma", course: "B.Tech ECE", fee: "₹85,000", status: "pending", avatar: "#8b5cf6" },
    { id: 3, name: "Rohan Das", course: "B.Tech Mech", fee: "₹1,10,000", status: "active", avatar: "#10B981" },
    { id: 4, name: "Sneha Gupta", course: "B.Tech Civil", fee: "₹45,000", status: "overdue", avatar: "#EF4444" },
    { id: 5, name: "Vikram Singh", course: "B.Tech CSE", fee: "₹1,20,000", status: "active", avatar: "#F59E0B" },
  ];

  const adminTableColumns = [
    {
      header: "Student",
      cell: (row) => (
        <div className="student-name-cell">
          <div className="student-avatar" style={{ background: row.avatar }}>
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          {row.name}
        </div>
      )
    },
    { accessor: "course", header: "Course" },
    { 
      header: "Fees Paid",
      cell: (row) => <span style={{ fontWeight: 600, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{row.fee}</span>
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    }
  ];

  const axisStyle = { fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-family)' };

  // FACULTY DASHBOARD VIEW
  if (userRole === 'faculty') {
    return <FacultyDashboard />;
  }

  // ADMIN DASHBOARD VIEW
  if (userRole === 'admin') {
    return (
      <motion.div className="dashboard-container" variants={containerVariants} initial="hidden" animate="show">
        
        {/* WELCOME HEADER */}
        <motion.div className="welcome-header" variants={itemVariants}>
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>University Analytics & Campus Performance Overview</p>
          </div>
          <div className="header-right">
            <span className="date-badge">{currentDate}</span>
            <Button icon={<FiPlus />} onClick={() => window.location.href = '/registration'}>
              Add Student
            </Button>
          </div>
        </motion.div>

        {/* TOP STATISTICS CARDS */}
        <motion.div className="stats-grid" variants={itemVariants}>
          {adminStats.map((stat, index) => (
            <KPI 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBgClass={stat.color}
              trend={stat.trend}
              trendValue={stat.sub}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* CHARTS GRID SECTION */}
        <motion.div className="admin-charts-grid" variants={itemVariants}>
          
          <Card title="Attendance Trends" subtitle="Monthly aggregate attendance rate" action={<Badge>Jan — Jun 2026</Badge>}>
            <div style={{ height: '230px', width: '100%', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendsData}>
                  <defs>
                    <linearGradient id="adminAttGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--success)" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisStyle} />
                  <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => `${v}%`} />
                  <RechartsTooltip content={<PremiumTooltip formatter={(v) => `${v}%`} />} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="var(--success)" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#adminAttGrad)" 
                    dot={{ r: 3.5, fill: 'var(--success)', stroke: 'var(--surface-color)', strokeWidth: 2 }}
                    activeDot={{ r: 5, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--surface-color)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Revenue Collection" subtitle="Monthly tuition fee collection" action={<Badge>Jan — Jun 2026</Badge>}>
            <div style={{ height: '230px', width: '100%', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueAnalyticsData} barCategoryGap="25%">
                  <defs>
                    <linearGradient id="revBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisStyle} />
                  <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <RechartsTooltip content={<PremiumTooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />} />
                  <Bar 
                    dataKey="collected" 
                    fill="url(#revBarGrad)" 
                    radius={[5, 5, 0, 0]} 
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </motion.div>

        {/* RECENT STUDENTS TABLE */}
        <motion.div className="admin-recent-section" variants={itemVariants}>
          <div className="section-title">
            <span>Recent Enrollments</span>
            <Link to="/students" className="view-all-link">View All &rarr;</Link>
          </div>
          <Card noPadding>
            <Table columns={adminTableColumns} data={recentStudentsData} />
          </Card>
        </motion.div>

      </motion.div>
    );
  }

  // ==========================================
  // STUDENT DASHBOARD VIEW
  // ==========================================
  return (
    <motion.div className="dashboard-container" variants={containerVariants} initial="hidden" animate="show">
      
      {/* 1. WELCOME HEADER */}
      <motion.div className="welcome-header student-header" variants={itemVariants}>
        <div className="welcome-text">
          <h1>Good Morning, {studentName} 👋</h1>
          <div className="student-meta-tags">
            <span className="meta-tag">B.Tech Computer Engineering</span>
            <span className="meta-dot">•</span>
            <span className="meta-tag">Semester 6</span>
            <span className="meta-dot">•</span>
            <span className="meta-tag">Enrollment No. 22CE001</span>
          </div>
        </div>
        <div className="header-right">
          <Button icon={<FiMaximize />}>Scan ID</Button>
        </div>
      </motion.div>

      {/* 2. QUICK STATS CARDS */}
      <motion.div className="stats-grid" variants={itemVariants}>
        {studentStats.map((stat, index) => (
          <KPI 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgClass={stat.color}
            trendValue={stat.sub}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="student-main-grid">
        
        {/* LEFT COLUMN */}
        <motion.div className="student-col-left" variants={itemVariants}>
          
          {/* Attendance Overview */}
          <div className="section-title">Attendance Overview</div>
          <Card className="attendance-overview-card">
            <div className="attendance-circle-container">
              <div className="progress-ring-wrapper">
                <svg className="progress-ring" width="120" height="120">
                  <circle className="progress-ring-bg" stroke="var(--hover-bg)" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60"/>
                  <motion.circle 
                    className="progress-ring-path" 
                    stroke="var(--primary)" 
                    strokeWidth="8" 
                    strokeDasharray="326" 
                    strokeLinecap="round" 
                    fill="transparent" 
                    r="52" cx="60" cy="60"
                    initial={{ strokeDashoffset: 326 }}
                    animate={{ strokeDashoffset: 326 - (326 * 0.92) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="ring-text">
                  <span className="ring-value">92%</span>
                </div>
              </div>
            </div>
            <div className="attendance-stats-info">
              <div className="att-stat-row">
                <div className="att-indicator present"></div>
                <div className="att-details">
                  <span className="att-label">Present Days</span>
                  <span className="att-val">150</span>
                </div>
              </div>
              <div className="att-stat-row">
                <div className="att-indicator absent"></div>
                <div className="att-details">
                  <span className="att-label">Absent Days</span>
                  <span className="att-val">13</span>
                </div>
              </div>
              <Link to="/attendance" className="view-all-link" style={{ marginTop: '8px', display: 'inline-block' }}>View Details &rarr;</Link>
            </div>
          </Card>

          {/* Recent Results */}
          <div className="section-title">
            <span>Course Result</span>
          </div>
          <Card className="course-result-card">
            <div className="vertical-pill-chart">
              {recentResults.map((res, idx) => {
                const percent = (res.marks / res.total) * 100;
                const isHighlight = idx === 1; // Highlight the middle one
                return (
                  <div key={res.id} className="pill-col">
                    <span className="pill-label">{res.subject}</span>
                    <div className="pill-track">
                      <motion.div 
                        className={`pill-fill ${isHighlight ? 'highlight' : ''}`} 
                        initial={{ height: 0 }}
                        animate={{ height: `${percent}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                      />
                    </div>
                    <span className="pill-value">{res.marks}</span>
                  </div>
                );
              })}
            </div>
          </Card>

        </motion.div>

        {/* MIDDLE COLUMN */}
        <motion.div className="student-col-middle" variants={itemVariants}>
          {/* Upcoming Classes */}
          <div className="section-title">
            <span>Upcoming Classes</span>
            <Link to="/timetable" className="view-all-link">Full Timetable &rarr;</Link>
          </div>
          <Card>
            <div className="upcoming-classes-list">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="upcoming-class-item">
                  <div className="class-time">
                    <FiClock size={14} />
                    <span>{cls.time}</span>
                  </div>
                  <div className="class-info">
                    <h4 className="class-subject">{cls.subject}</h4>
                    <p className="class-faculty">{cls.faculty} • {cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* AI Suggestions / Progress Tracker */}
          <div className="section-title" style={{ marginTop: '32px' }}>
            <span>AI Study Assistant</span>
            <FiCpu color="var(--primary)" />
          </div>
          <Card style={{ background: 'linear-gradient(135deg, var(--surface-color), var(--active-bg))', border: '1px solid var(--primary-soft)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '12px' }}>
                <FiTarget size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--text-base)' }}>Study Streak: 12 Days 🔥</h4>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>You are well prepared for your upcoming DBMS quiz. Review chapter 4 to maximize your score.</p>
                <Button variant="secondary" size="sm" style={{ marginTop: '12px' }}>View Recommended Material</Button>
              </div>
            </div>
          </Card>
          
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div className="student-col-right" variants={itemVariants}>
          {/* Recent Announcements */}
          <div className="section-title">
            <span>Announcements</span>
            <Link to="/announcements" className="view-all-link">View All &rarr;</Link>
          </div>
          <Card>
            <div className="dashboard-announcements-list">
              {announcements.map((item) => (
                <div key={item.id} className="dashboard-announce-item">
                  <div className={`announce-indicator ${item.type}`}></div>
                  <div className="announce-content">
                    <h4 className="announce-title">{item.title}</h4>
                    <p className="announce-date">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;