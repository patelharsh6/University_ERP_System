// src/pages/student/Courses.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';
import { FiClock, FiCalendar, FiAward, FiBook, FiUser, FiArrowRight } from 'react-icons/fi';

const Courses = () => {
  // Mock Data aligned with user request
  const overviewData = {
    program: "B.Tech Computer Engineering",
    duration: "4 Years",
    semester: "6",
    creditsEarned: "115"
  };

  const enrolledCourses = [
    { id: 'c1', code: 'CE601', name: 'Database Management Systems', faculty: 'Dr. Rajesh Sharma', credits: 4 },
    { id: 'c2', code: 'CE602', name: 'Artificial Intelligence', faculty: 'Prof. Anita Verma', credits: 3 },
    { id: 'c3', code: 'CE603', name: 'Computer Networks', faculty: 'Dr. Sanjay Gupta', credits: 4 },
    { id: 'c4', code: 'CE604', name: 'Software Engineering', faculty: 'Prof. Meera Desai', credits: 3 },
    { id: 'c5', code: 'CE605', name: 'Web Technologies Lab', faculty: 'Mr. Vivek Singh', credits: 2 },
  ];

  return (
    <div className="courses-container">
      
      {/* 1. COURSE OVERVIEW */}
      <div className="course-overview-card">
        <div className="overview-header">
          <h1>{overviewData.program}</h1>
          <p>Undergraduate Degree Program</p>
        </div>
        
        <div className="overview-stats-grid">
          <div className="overview-stat-item">
            <span className="stat-title"><FiClock className="stat-icon" /> Duration</span>
            <span className="stat-value">{overviewData.duration}</span>
          </div>
          <div className="overview-stat-item">
            <span className="stat-title"><FiCalendar className="stat-icon" /> Current Semester</span>
            <span className="stat-value">Semester {overviewData.semester}</span>
          </div>
          <div className="overview-stat-item">
            <span className="stat-title"><FiAward className="stat-icon" /> Credits Earned</span>
            <span className="stat-value">{overviewData.creditsEarned}</span>
          </div>
        </div>
      </div>

      {/* 2. ENROLLED COURSES */}
      <h2 className="section-heading">Enrolled Courses (Sem {overviewData.semester})</h2>
      
      <div className="enrolled-grid">
        {enrolledCourses.map(course => (
          <div key={course.id} className="enrolled-card">
            <div className="course-code-badge">{course.code}</div>
            <h3>{course.name}</h3>
            
            <div className="course-details-list">
              <div className="detail-row">
                <FiUser className="detail-icon" />
                <span>Faculty: {course.faculty}</span>
              </div>
              <div className="detail-row">
                <FiBook className="detail-icon" />
                <span>Credits: {course.credits}</span>
              </div>
            </div>

            <Link to={`/subjects`} className="btn-view-subject">
              View Subject Details <FiArrowRight />
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Courses;
