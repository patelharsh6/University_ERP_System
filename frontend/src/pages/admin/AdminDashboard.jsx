// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import '../student/Dashboard.css'; // Reuse Dashboard.css for now
import { 
  FiUser, FiCalendar, FiCreditCard, FiBookOpen, FiPlus
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
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

const AdminDashboard = () => {
  const rolePrefix = '/a';
  
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
          <Button icon={<FiPlus />} onClick={() => window.location.href = '/a/registration'}>
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
          <Link to={`${rolePrefix}/students`} className="view-all-link">View All &rarr;</Link>
        </div>
        <Card noPadding>
          <Table columns={adminTableColumns} data={recentStudentsData} />
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default AdminDashboard;
