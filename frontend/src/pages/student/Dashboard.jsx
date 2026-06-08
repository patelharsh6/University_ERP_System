// src/pages/student/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import { 
  FaUserGraduate, FaCalendarCheck, FaMoneyBillWave, FaChartLine, 
  FaQrcode, FaCheckCircle, FaExclamationTriangle, FaBook, FaPlus,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
      background: '#0c1425',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '8px',
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    }}>
      <p style={{ color: '#8b9ab5', fontSize: '0.7rem', fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em' }}>{label}</p>
      <p style={{ color: '#f1f5f9', fontSize: '0.92rem', fontWeight: 700, margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>{val}</p>
    </div>
  );
};

const Dashboard = ({ userRole }) => {
  
  // --- STUDENT MOCK DATA ---
  const studentName = "Harsh";
  const currentDate = "Mon, 08 Jun 2026";
  
  const studentStats = [
    { title: "Attendance", value: "82%", icon: <FaCalendarCheck />, color: "stat-green", sub: "Good" },
    { title: "SGPA (Sem 5)", value: "8.72", icon: <FaUserGraduate />, color: "stat-blue", sub: "Excellent" },
    { title: "Pending Fees", value: "₹45k", icon: <FaMoneyBillWave />, color: "stat-red", sub: "Due Soon" },
    { title: "Credits Earned", value: "124", icon: <FaChartLine />, color: "stat-cyan", sub: "Total" },
  ];

  const upcomingClasses = [
    { id: 1, subject: "Data Structures", time: "10:00", ampm: "AM", faculty: "Prof. Sharma", room: "Lab 3", isLive: false },
    { id: 2, subject: "DBMS (Lecture)", time: "12:00", ampm: "PM", faculty: "Prof. Verma", room: "Room 204", isLive: true },
    { id: 3, subject: "Operating Systems", time: "02:00", ampm: "PM", faculty: "Prof. Gupta", room: "Hall B", isLive: false },
  ];

  const announcements = [
    { id: 1, title: "Mid-Sem Exam Schedule Released", date: "Today" },
    { id: 2, title: "TechFest Registration Open", date: "Yesterday" },
    { id: 3, title: "Holiday on Friday declared", date: "10 Feb" },
  ];

  const performanceData = [
    { name: 'Sem 1', sgpa: 7.2 },
    { name: 'Sem 2', sgpa: 7.8 },
    { name: 'Sem 3', sgpa: 8.1 },
    { name: 'Sem 4', sgpa: 8.5 },
    { name: 'Sem 5', sgpa: 8.7 },
  ];

  // --- ADMIN MOCK DATA ---
  const adminStats = [
    { title: "Total Students", value: "12,500", icon: <FaUserGraduate />, color: "stat-blue", sub: "+4% from last sem", trend: "up" },
    { title: "Attendance Rate", value: "92%", icon: <FaCalendarCheck />, color: "stat-green", sub: "Goal: >90%", trend: "up" },
    { title: "Revenue", value: "₹45,00,000", icon: <FaMoneyBillWave />, color: "stat-purple", sub: "Outstanding: ₹8.4L", trend: "up" },
    { title: "Courses Offered", value: "48", icon: <FaBook />, color: "stat-cyan", sub: "6 departments", trend: "neutral" },
  ];

  // 1. Attendance Trends
  const attendanceTrendsData = [
    { month: 'Jan', rate: 94 },
    { month: 'Feb', rate: 92 },
    { month: 'Mar', rate: 95 },
    { month: 'Apr', rate: 93 },
    { month: 'May', rate: 91 },
    { month: 'Jun', rate: 92 },
  ];

  // 2. Revenue Analytics
  const revenueAnalyticsData = [
    { month: 'Jan', collected: 1200000 },
    { month: 'Feb', collected: 1800000 },
    { month: 'Mar', collected: 1500000 },
    { month: 'Apr', collected: 900000 },
    { month: 'May', collected: 2100000 },
    { month: 'Jun', collected: 4500000 },
  ];

  // 3. Student Growth
  const growthData = [
    { year: '2021', students: 8500 },
    { year: '2022', students: 9600 },
    { year: '2023', students: 10400 },
    { year: '2024', students: 11200 },
    { year: '2025', students: 12100 },
    { year: '2026', students: 12500 },
  ];

  // 4. Course Enrollments
  const enrollmentData = [
    { name: 'CS', value: 4500, color: '#2563eb' },
    { name: 'ECE', value: 3200, color: '#0ea5e9' },
    { name: 'Mech', value: 2400, color: '#059669' },
    { name: 'Civil', value: 1400, color: '#d97706' },
    { name: 'Other', value: 1000, color: '#7c3aed' },
  ];

  // 5. Recent Students Table
  const recentStudents = [
    { id: 1, name: "Aarav Mehta", course: "B.Tech CSE", fee: "₹1,20,000", status: "active", avatar: "#2563eb" },
    { id: 2, name: "Priya Sharma", course: "B.Tech ECE", fee: "₹85,000", status: "pending", avatar: "#7c3aed" },
    { id: 3, name: "Rohan Das", course: "B.Tech Mech", fee: "₹1,10,000", status: "active", avatar: "#059669" },
    { id: 4, name: "Sneha Gupta", course: "B.Tech Civil", fee: "₹45,000", status: "overdue", avatar: "#dc2626" },
    { id: 5, name: "Vikram Singh", course: "B.Tech CSE", fee: "₹1,20,000", status: "active", avatar: "#d97706" },
  ];

  // Common chart axis styling
  const axisStyle = { fill: '#94A3B8', fontSize: 10.5, fontFamily: 'DM Sans, sans-serif' };

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
              <FaPlus /> Add Student
            </Link>
          </div>
        </div>

        {/* TOP STATISTICS CARDS */}
        <div className="stats-grid">
          {adminStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{stat.title}</span>
                <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {stat.trend === 'up' && <FaArrowUp style={{ color: '#059669', fontSize: '0.6rem' }} />}
                {stat.trend === 'down' && <FaArrowDown style={{ color: '#dc2626', fontSize: '0.6rem' }} />}
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS GRID SECTION (2x2) */}
        <div className="admin-charts-grid">
          
          {/* Chart 1: Attendance Trends (AreaChart) */}
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
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light, #e2e8f0)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisStyle} />
                  <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<PremiumTooltip formatter={(v) => `${v}%`} />} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#059669" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#adminAttGrad)" 
                    dot={{ r: 3.5, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, stroke: '#059669', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Revenue Analytics (BarChart) */}
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
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light, #e2e8f0)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisStyle} />
                  <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip content={<PremiumTooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />} />
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

          {/* Chart 3: Student Growth (LineChart) */}
          <div className="dashboard-card chart-container-box">
            <div className="chart-info">
              <div>
                <h4>Student Growth</h4>
                <p>Total active enrollments over time</p>
              </div>
              <span className="chart-period-badge">2021 — 2026</span>
            </div>
            <div style={{ height: '230px', width: '100%', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.18}/>
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light, #e2e8f0)" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={axisStyle} />
                  <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<PremiumTooltip formatter={(v) => v.toLocaleString('en-IN') + ' students'} />} />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#0ea5e9" 
                    strokeWidth={2} 
                    fillOpacity={1}
                    fill="url(#growthGrad)"
                    dot={{ r: 3.5, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, stroke: '#0ea5e9', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Department Split (Pie/Donut) */}
          <div className="dashboard-card chart-container-box">
            <div className="chart-info">
              <div>
                <h4>Department Split</h4>
                <p>Distribution by branch</p>
              </div>
              <span className="chart-period-badge">12,500 total</span>
            </div>
            <div style={{ height: '230px', width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enrollmentData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {enrollmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PremiumTooltip formatter={(v) => v.toLocaleString('en-IN') + ' students'} />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '0.78rem', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* RECENT STUDENTS TABLE */}
        <div className="admin-recent-section">
          <div className="section-title" style={{ marginBottom: '16px' }}>
            <span>Recent Students</span>
            <Link to="/students" style={{ fontSize: '0.82rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'none', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }}>
              View All &rarr;
            </Link>
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
                    <td style={{ color: 'var(--text-muted, #64748B)' }}>{s.course}</td>
                    <td style={{ fontWeight: 600, fontFamily: 'Sora, sans-serif', fontSize: '0.85rem' }}>{s.fee}</td>
                    <td>
                      <span className={`status-pill ${s.status}`}>
                        <span className="status-dot"></span>
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

  // STUDENT DASHBOARD VIEW (Default View)
  return (
    <div className="dashboard-container">
      
      {/* WELCOME HEADER */}
      <div className="welcome-header">
        <div className="welcome-text">
          <h1>Good Morning, {studentName} 👋</h1>
          <p>Semester 6 &bull; Computer Science Engineering</p>
        </div>
        <div className="header-right">
          <span className="date-badge">{currentDate}</span>
          <button className="quick-action-btn">
            <FaQrcode /> Scan QR
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="stats-grid">
        {studentStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{stat.title}</span>
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN (70%) */}
        <div className="left-column">
          
          {/* Upcoming Classes */}
          <div className="section-title">
            <span>📅 Today's Schedule</span>
            <Link to="/timetable" style={{ fontSize: '0.82rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'none', fontWeight: '600' }}>View Timetable</Link>
          </div>
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className={`class-item ${cls.isLive ? 'live' : ''}`}>
                <div className="class-time-box">
                  <div className="time-start">{cls.time}</div>
                  <div className="time-ampm">{cls.ampm}</div>
                </div>
                <div className="class-details">
                  <div className="subject-name" style={{ color: 'var(--text-primary)' }}>
                    {cls.subject}
                    {cls.isLive && <span style={{ color: '#2563eb', marginLeft: '8px', fontSize: '0.78rem', fontWeight: 'bold' }}>● LIVE</span>}
                  </div>
                  <div className="faculty-name">{cls.faculty} • {cls.room}</div>
                </div>
                {cls.isLive && (
                  <button className="btn-scan-small">
                    <FaQrcode /> Mark
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Recent Announcements */}
          <div className="section-title">
            <span>📢 Notice Board</span>
            <Link to="/announcements" style={{ fontSize: '0.82rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'none', fontWeight: '600' }}>View All</Link>
          </div>
          <div className="dashboard-card">
            {announcements.map((item) => (
              <div key={item.id} className="announce-item">
                <div className="announce-title" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{item.title}</div>
                <div className="announce-meta">{item.date} • Admin Office</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN (30%) */}
        <div className="right-column">
          
          {/* Performance Graph */}
          <div className="section-title">📊 Performance</div>
          <div className="dashboard-card" style={{ height: '220px', padding: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<PremiumTooltip formatter={(v) => `SGPA: ${v}`} />} />
                <Area type="monotone" dataKey="sgpa" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Reminder */}
          <div className="fee-warning-card">
            <div style={{ color: 'var(--danger, #dc2626)', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }}>⚠️ Pending Fees</div>
            <div className="due-amount">₹45,000</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748B)', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>Due by 15 Mar 2026</p>
            <Link to="/billing" className="btn-pay-now" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', lineHeight: '2.5' }}>Pay Now</Link>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="section-title" style={{ marginTop: '32px' }}>Recent Activity</div>
          <div className="activity-timeline">
            <div className="activity-item">
              <div className="activity-icon" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--success, #059669)' }}><FaCheckCircle /></div>
              <div className="activity-content">
                <h4 style={{ color: 'var(--text-primary)' }}>Attendance Marked</h4>
                <p>Data Structures (Lab)</p>
                <div className="activity-time">10:05 AM Today</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: 'var(--warning, #d97706)' }}><FaExclamationTriangle /></div>
              <div className="activity-content">
                <h4 style={{ color: 'var(--text-primary)' }}>Assignment Due</h4>
                <p>Cloud Computing Unit 3</p>
                <div className="activity-time">Tomorrow, 11:59 PM</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;