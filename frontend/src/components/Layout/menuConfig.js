// src/components/Layout/menuConfig.js
import React from 'react';
import { 
  FaHome, 
  FaBook, 
  FaChalkboardTeacher, 
  FaCalendarAlt, 
  FaUserGraduate, 
  FaClipboardList, 
  FaGraduationCap, 
  FaMoneyBill, 
  FaCreditCard, 
  FaBullhorn, 
  FaCommentAlt, 
  FaCog,
  FaUserPlus
} from 'react-icons/fa';

export const menuConfig = [
  {
    category: "",
    items: [
      { title: "Dashboard", icon: <FaHome />, path: "/" }
    ]
  },
  {
    category: "ACADEMICS",
    items: [
      { title: "Courses", icon: <FaBook />, path: "/courses" },
      { title: "Subjects", icon: <FaChalkboardTeacher />, path: "/course-management" },
      { title: "Timetable", icon: <FaCalendarAlt />, path: "/timetable" }
    ]
  },
  {
    category: "STUDENTS",
    items: [
      { title: "Students", icon: <FaUserGraduate />, path: "/students" },
      { title: "Registration", icon: <FaUserPlus />, path: "/registration" },
      { title: "Attendance", icon: <FaClipboardList />, path: "/attendance", badge: "82%", badgeType: "success" },
      { title: "Results", icon: <FaGraduationCap />, path: "/results" }
    ]
  },
  {
    category: "FINANCE",
    items: [
      { title: "Fees", icon: <FaMoneyBill />, path: "/billing" },
      { title: "Payments", icon: <FaCreditCard />, path: "/billing", badge: "Due", badgeType: "danger" }
    ]
  },
  {
    category: "COMMUNICATION",
    items: [
      { title: "Announcements", icon: <FaBullhorn />, path: "/announcements", badge: "3", badgeType: "danger" },
      { title: "Feedback", icon: <FaCommentAlt />, path: "/feedback" }
    ]
  },
  {
    category: "",
    items: [
      { title: "Settings", icon: <FaCog />, path: "/profile" }
    ]
  }
];