// src/components/Layout/menuConfig.js
import React from 'react';
import { 
  FiHome, FiUser, FiBookOpen, FiLayers, FiCheckCircle, FiCalendar, FiAward, 
  FiEdit3, FiCreditCard, FiRadio, FiFileText, FiSend, FiMessageSquare, FiBell,
  FiSettings, FiMessageCircle, FiCheckSquare, FiBarChart2, FiList, FiSun, FiGrid,
  FiHeart, FiUserCheck
} from 'react-icons/fi';

export const studentMenu = [
  {
    category: "",
    items: [
      { title: "My Institution", icon: <FiHome />, path: "/s/institution" },
      { title: "Courses", icon: <FiBookOpen />, path: "/s/courses" },
      { title: "Attendance", icon: <FiCheckSquare />, path: "/s/attendance" },
      { title: "Timetable", icon: <FiGrid />, path: "/s/timetable" },
      { title: "Messages", icon: <FiMessageCircle />, path: "/s/messages" },
      { title: "Notifications", icon: <FiBell />, path: "/s/notifications", badge: "18", badgeType: "announcement" },
      { title: "Reports", icon: <FiBarChart2 />, path: "/s/reports" },
      { title: "Assessments", icon: <FiList />, path: "/s/assessments" },
      { title: "Billing", icon: <FiCreditCard />, path: "/s/billing" },
      { title: "Exam schedules", icon: <FiCalendar />, path: "/s/exam-schedules" },
      { title: "Holidays", icon: <FiSun />, path: "/s/holidays" },
      { title: "Student counselling", icon: <FiHeart />, path: "/s/counselling" },
      { title: "Enrollment", icon: <FiUserCheck />, path: "/s/enrollment" },
      { title: "Announcement", icon: <FiRadio />, path: "/s/announcements" },
      { title: "Final Result", icon: <FiAward />, path: "/s/results" },
      { title: "Clearance", icon: <FiCheckCircle />, path: "/s/clearance" },
      { title: "Feedback", icon: <FiMessageSquare />, path: "/s/feedback" }
    ]
  }
];

export const facultyMenu = [
  {
    category: "",
    items: [
      { title: "Dashboard", icon: <FiHome />, path: "/f/dashboard" },
    ]
  },
  {
    category: "ACADEMICS",
    items: [
      { title: "Course Management", icon: <FiBookOpen />, path: "/f/courses" },
    ]
  }
];

export const adminMenu = [
  {
    category: "",
    items: [
      { title: "Dashboard", icon: <FiHome />, path: "/a/dashboard" },
    ]
  },
  {
    category: "MANAGEMENT",
    items: [
      { title: "Students", icon: <FiUser />, path: "/a/students" },
      { title: "Registration", icon: <FiCheckCircle />, path: "/a/registration" },
    ]
  }
];