// src/pages/student/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import { 
  FiUser, FiCalendar, FiCreditCard, FiTrendingUp, 
  FiMaximize, FiCheckCircle, FiAlertTriangle, FiBookOpen, FiPlus,
  FiArrowUp, FiArrowDown, FiEdit3, FiAward, FiRadio, FiClock
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import FacultyDashboard from '../faculty/FacultyDashboard';
import { Link } from 'react-router-dom';

/* ─────────────── Custom Recharts Tooltip ─────────────── */
const PremiumTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  const val = formatter ? formatter(payload[0].value) : payload[0].value;
  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '8px',
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ color: '#f8fafc', fontSize: '0.92rem', fontWeight: 700, margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>{val}</p>
    </div>
  );
};

const Dashboard = ({ userRole }) => {
  
  // --- STUDENT MOCK DATA ---
  const studentName = "Harsh";
  
  const studentStats = [
    { title: "Attendance", value: "92%", icon: <FiCalendar />, color: "stat-teal", sub: "Excellent" },
    { title: "CGPA", value: "8.7", icon: <FiAward />, color: "stat-indigo", sub: "Top 10%" },
    { title: "Pending Assignments", value: "3", icon: <FiEdit3 />, color: "stat-amber", sub: "Due this week" },
    { title: "Outstanding Fees", value: "₹5,000", icon: <FiCreditCard />, color: "stat-rose", sub: "Due 15 Mar" },
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

  // --- ADMIN MOCK DATA (Retained) ---
  const currentDate = "Mon, 08 Jun 2026";
  const adminStats = [
    { title: "Total Students", value: "12,500", icon: <FiUser />, color: "stat-indigo", sub: "+4% from last sem", trend: "up" },
    { title: "Attendance Rate", value: "92%", icon: <FiCalendar />, color: "stat-teal", sub: "Goal: >90%", trend: "up" },
    { title: "Revenue", value: "₹45,00,000", icon: <FiCreditCard />, color: "stat-purple", sub: "Outstanding: ₹8.4L", trend: "up" },
    { title: "Courses Offered", value: "48", icon: <FiBookOpen />, color: "stat-cyan", sub: "6 departments", trend: "neutral" },
  ];

  const attendanceTrendsData = [
    { month: 'Jan', rate: 94 }, { month: 'Feb', rate: 92 }, { month: 'Mar', rate: 95 },
    { month: 'Apr', rate: 93 }, { month: 'May', rate: 91 }, { month: 'Jun', rate: 92 },
  ];

  const revenueAnalyticsData = [
    { month: 'Jan', collected: 1200000 }, { month: 'Feb', collected: 1800000 }, { month: 'Mar', collected: 1500000 },
    { month: 'Apr', collected: 900000 }, { month: 'May', collected: 2100000 }, { month: 'Jun', collected: 4500000 },
  ];

  const growthData = [
    { year: '2021', students: 8500 }, { year: '2022', students: 9600 }, { year: '2023', students: 10400 },
    { year: '2024', students: 11200 }, { year: '2025', students: 12100 }, { year: '2026', students: 12500 },
  ];

  const enrollmentData = [
    { name: 'CS', value: 4500, color: '#6366f1' }, { name: 'ECE', value: 3200, color: '#0d9488' },
    { name: 'Mech', value: 2400, color: '#f59e0b' }, { name: 'Civil', value: 1400, color: '#f43f5e' },
    { name: 'Other', value: 1000, color: '#8b5cf6' },
  ];

  const recentStudents = [
    { id: 1, name: "Aarav Mehta", course: "B.Tech CSE", fee: "₹1,20,000", status: "active", avatar: "#6366f1" },
    { id: 2, name: "Priya Sharma", course: "B.Tech ECE", fee: "₹85,000", status: "pending", avatar: "#8b5cf6" },
    { id: 3, name: "Rohan Das", course: "B.Tech Mech", fee: "₹1,10,000", status: "active", avatar: "#0d9488" },
    { id: 4, name: "Sneha Gupta", course: "B.Tech Civil", fee: "₹45,000", status: "overdue", avatar: "#f43f5e" },
    { id: 5, name: "Vikram Singh", course: "B.Tech CSE", fee: "₹1,20,000", status: "active", avatar: "#f59e0b" },
  ];

  const axisStyle = { fill: '#94a3b8', fontSize: 10.5, fontFamily: 'DM Sans, sans-serif' };

  // FACULTY DASHBOARD VIEW
  if (userRole === 'faculty') {
    return <FacultyDashboard />;
  }

  // ADMIN DASHBOARD VIEW
  if (userRole === 'admin') {
    return (
      <div className="dashboard-container">
        
        {/* WELCOME HEADER */}
        <div className="welcome-header">
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>University Analytics &bull; Campus Performance Overview</p>
          </div>
          <div className="header-right">
            <span className="date-badge">{currentDate}</span>
            <Link to="/registration" className="quick-action-btn" style={{ textDecoration: 'none' }}>
              <FiPlus /> Add Student
            </Link>
          </div>
        </div>

        {/* TOP STATISTICS CARDS */}
        <div className="stats-grid">
          {adminStats.map((stat, index) => (
            <div key={index} className="stat-card admin-stat">
              <div className="stat-header">
                <span className="stat-label">{stat.title}</span>
                <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {stat.trend === 'up' && <FiArrowUp style={{ color: '#0d9488', fontSize: '0.8rem' }} />}
                {stat.trend === 'down' && <FiArrowDown style={{ color: '#f43f5e', fontSize: '0.8rem' }} />}
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS GRID SECTION */}
        <div className="admin-charts-grid">
          
          <div className="dashboard-card chart-container-box">
            <div className="chart-info">
              <div>
                <h4>Attendance Trends</h4>
                <p>Monthly aggregate attendance rate</p>
              </div>
              <span className="chart-period-badge">Jan — Jun 2026</span>
            </div>
            <div style={{ height: '230px', width: '100%', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendsData}>
                  <defs>
                    <linearGradient id="adminAttGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border, #e2e8f0)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisStyle} />
                  <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => `${v}%`} />
                  <RechartsTooltip content={<PremiumTooltip formatter={(v) => `${v}%`} />} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#0d9488" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#adminAttGrad)" 
                    dot={{ r: 3.5, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, stroke: '#0d9488', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-card chart-container-box">
            <div className="chart-info">
              <div>
                <h4>Revenue Collection</h4>
                <p>Monthly tuition fee collection</p>
              </div>
              <span className="chart-period-badge">Jan — Jun 2026</span>
            </div>
            <div style={{ height: '230px', width: '100%', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueAnalyticsData} barCategoryGap="25%">
                  <defs>
                    <linearGradient id="revBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border, #e2e8f0)" />
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
          </div>

        </div>

        {/* RECENT STUDENTS TABLE */}
        <div className="admin-recent-section">
          <div className="section-title" style={{ marginBottom: '16px' }}>
            <span>Recent Enrollments</span>
            <Link to="/students" className="view-all-link">View All &rarr;</Link>
          </div>
          <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Fees Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar" style={{ background: s.avatar }}>
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.course}</td>
                    <td style={{ fontWeight: 600, fontFamily: 'Sora, sans-serif', fontSize: '13px' }}>{s.fee}</td>
                    <td>
                      <span className={`status-pill ${s.status}`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // STUDENT DASHBOARD VIEW (Requested Redesign)
  // ==========================================
  return (
    <div className="dashboard-container">
      
      {/* 1. WELCOME HEADER */}
      <div className="welcome-header student-header">
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
          <button className="quick-action-btn">
            <FiMaximize /> Scan ID
          </button>
        </div>
      </div>

      {/* 2. QUICK STATS CARDS */}
      <div className="stats-grid">
        {studentStats.map((stat, index) => (
          <div key={index} className={`stat-card`}>
            <div className="stat-header">
              <span className="stat-label">{stat.title}</span>
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="student-main-grid">
        
        {/* LEFT COLUMN */}
        <div className="student-col-left">
          
          {/* Attendance Overview */}
          <div className="section-title">Attendance Overview</div>
          <div className="dashboard-card attendance-overview-card">
            <div className="attendance-circle-container">
              <div className="progress-ring-wrapper">
                <svg className="progress-ring" width="120" height="120">
                  <circle className="progress-ring-bg" stroke="var(--card-border)" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60"/>
                  <circle className="progress-ring-path" stroke="var(--primary)" strokeWidth="8" strokeDasharray="326" strokeDashoffset="26" strokeLinecap="round" fill="transparent" r="52" cx="60" cy="60"/>
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
          </div>

          {/* Recent Results */}
          <div className="section-title">
            <span>Course Result</span>
            <span style={{color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer', lineHeight: 1}}>—</span>
          </div>
          <div className="dashboard-card course-result-card" style={{ padding: '30px 20px' }}>
            <div className="vertical-pill-chart">
              {recentResults.map((res, idx) => {
                const percent = (res.marks / res.total) * 100;
                const isHighlight = idx === 1; // Highlight the middle one
                return (
                  <div key={res.id} className="pill-col">
                    <span className="pill-label">{res.subject}</span>
                    <div className="pill-track">
                      <div className={`pill-fill ${isHighlight ? 'highlight' : ''}`} style={{ height: `${percent}%` }}></div>
                    </div>
                    <span className="pill-value">{res.marks}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN */}
        <div className="student-col-middle">
          {/* Upcoming Classes */}
          <div className="section-title">
            <span>Upcoming Classes</span>
            <Link to="/timetable" className="view-all-link">Full Timetable &rarr;</Link>
          </div>
          <div className="dashboard-card">
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
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="student-col-right">
          {/* Recent Announcements */}
          <div className="section-title">
            <span>Announcements</span>
            <Link to="/announcements" className="view-all-link">View All &rarr;</Link>
          </div>
          <div className="dashboard-card">
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
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;