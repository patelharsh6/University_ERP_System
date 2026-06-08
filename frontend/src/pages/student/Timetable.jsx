// src/pages/student/Timetable.jsx
import React, { useState } from 'react';
import './Timetable.css';
import { FiChevronLeft, FiChevronRight, FiMaximize, FiCheckCircle, FiClock, FiUser, FiMapPin } from 'react-icons/fi';

const Timetable = () => {
  // Mock Date State
  const [currentDate, setCurrentDate] = useState("08 Jun 2026");

  // --- MOCK SCHEDULE DATA ---
  const scheduleData = [
    {
      id: 1,
      subject: "Database Management Systems",
      code: "CE601",
      type: "Lecture",
      faculty: "Dr. Rajesh Sharma",
      room: "Room 304",
      time: "09:10 AM - 10:00 AM",
      duration: "50 min",
      status: "completed", 
      attendance: "Present"
    },
    {
      id: 2,
      subject: "Artificial Intelligence",
      code: "CE602",
      type: "Lecture",
      faculty: "Prof. Anita Verma",
      room: "Room 204",
      time: "10:00 AM - 10:50 AM",
      duration: "50 min",
      status: "completed",
      attendance: "Present"
    },
    {
      id: 3,
      subject: "Computer Networks (Lab)",
      code: "CE603",
      type: "Practical",
      faculty: "Dr. Sanjay Gupta",
      room: "Network Lab 2",
      time: "11:00 AM - 12:40 PM",
      duration: "100 min",
      status: "active", // 🟢 THIS IS HAPPENING NOW (Show QR)
      attendance: "Pending"
    },
    {
      id: 4,
      subject: "Software Engineering",
      code: "CE604",
      type: "Lecture",
      faculty: "Prof. Meera Desai",
      room: "Room 101",
      time: "01:30 PM - 02:20 PM",
      duration: "50 min",
      status: "upcoming", // Future class
      attendance: null
    }
  ];

  return (
    <div className="timetable-container">
      
      {/* 1. HEADER */}
      <div className="timetable-header">
        <div className="header-text">
          <h2>Timetable</h2>
          <div className="semester-badge">SEMESTER-VI | 2025-26</div>
        </div>
        <button className="weekly-btn">Weekly Schedule</button>
      </div>

      {/* 2. DATE NAVIGATOR */}
      <div className="date-navigator">
        <button className="nav-arrow"><FiChevronLeft /></button>
        <span className="current-date-display">{currentDate}</span>
        <button className="nav-arrow"><FiChevronRight /></button>
      </div>

      {/* 3. CLASS LIST */}
      <div className="class-list">
        {scheduleData.map((cls) => (
          <div key={cls.id} className={`schedule-card ${cls.status}`}>
            <div className="card-content">
              
              {/* LEFT: Class Details */}
              <div className="info-section">
                <div className="subject-title">
                  {cls.subject} <span className="subject-code">({cls.code})</span>
                </div>
                
                <div className="time-row">
                  <FiClock className="detail-icon" /> {cls.time} <span className="duration-span">({cls.duration})</span>
                </div>

                <div className="faculty-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '16px' }}>
                    <FiUser /> {cls.faculty}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiMapPin /> {cls.room}
                  </span>
                </div>

                <div className="type-badge">{cls.type}</div>
              </div>

              {/* RIGHT: Status / QR Action */}
              <div className="action-area">
                
                {/* 🔵 CASE 1: ACTIVE CLASS (Show QR Button) */}
                {cls.status === 'active' && (
                  <button className="btn-qr" onClick={() => alert("Opening Camera Scanner...")}>
                    <FiMaximize size={18} /> Scan ID
                  </button>
                )}

                {/* 🟢 CASE 2: PAST CLASS (Attendance Recorded) */}
                {cls.status === 'completed' && (
                  <div className="status-text recorded">
                    <FiCheckCircle size={18} /> Recorded
                  </div>
                )}

                {/* ⚪ CASE 3: FUTURE CLASS */}
                {cls.status === 'upcoming' && (
                  <div className="status-text upcoming">
                    <FiClock size={18} /> Scheduled
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Timetable;