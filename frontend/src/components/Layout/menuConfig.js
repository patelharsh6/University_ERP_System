// src/components/Layout/menuConfig.js
import React from 'react';
import { 
  FiHome, 
  FiUser, 
  FiBookOpen, 
  FiLayers, 
  FiCheckCircle, 
  FiCalendar, 
  FiAward, 
  FiEdit3, 
  FiCreditCard, 
  FiRadio, 
  FiFileText, 
  FiSend, 
  FiMessageSquare, 
  FiBell,
  FiSettings
} from 'react-icons/fi';

export const menuConfig = [
  {
    category: "",
    items: [
      { title: "Dashboard", icon: <FiHome />, path: "/" },
      { title: "Profile", icon: <FiUser />, path: "/profile" }
    ]
  },
  {
    category: "ACADEMICS",
    items: [
      { title: "Courses", icon: <FiBookOpen />, path: "/courses" },
      { title: "Subjects", icon: <FiLayers />, path: "/subjects" },
      { title: "Attendance", icon: <FiCheckCircle />, path: "/attendance", badge: "92%", badgeType: "attend" },
      { title: "Timetable", icon: <FiCalendar />, path: "/timetable" },
      { title: "Results", icon: <FiAward />, path: "/results" },
      { title: "Assignments", icon: <FiEdit3 />, path: "/assignments", badge: "3", badgeType: "due" }
    ]
  },
  {
    category: "FINANCE",
    items: [
      { title: "Fees", icon: <FiCreditCard />, path: "/billing" }
    ]
  },
  {
    category: "COMMUNICATION",
    items: [
      { title: "Announcements", icon: <FiRadio />, path: "/announcements" },
      { title: "Notifications", icon: <FiBell />, path: "/notifications", badge: "2", badgeType: "announcement" }
    ]
  },
  {
    category: "RESOURCES",
    items: [
      { title: "Study Materials", icon: <FiFileText />, path: "/materials" },
      { title: "Leave Requests", icon: <FiSend />, path: "/leaves" }
    ]
  },
  {
    category: "",
    items: [
      { title: "Feedback", icon: <FiMessageSquare />, path: "/feedback" },
      { title: "Settings", icon: <FiSettings />, path: "/settings" }
    ]
  }
];