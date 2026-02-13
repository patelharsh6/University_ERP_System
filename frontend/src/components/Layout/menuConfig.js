// src/components/Layout/menuConfig.js
import { FaHome, FaBook, FaMoneyBill, FaChalkboardTeacher, FaUsers, FaCog, FaClipboardList } from 'react-icons/fa';

export const menuConfig = {
  student: [
    { category: "Main", items: [ { title: "Dashboard", icon: <FaHome />, path: "/dashboard" } ] },
    { category: "Academics", items: [
        { title: "My Courses", icon: <FaBook />, path: "/courses" },
        { title: "Attendance", icon: <FaClipboardList />, path: "/attendance" },
        { title: "Timetable", icon: <FaClipboardList />, path: "/timetable" },
        { title: "Results", icon: <FaClipboardList />, path: "/results" },
        { title: "Reports", icon: <FaClipboardList />, path: "/reports" },
        { title: "Announcements", icon: <FaClipboardList />, path: "/announcements" },
        { title: "Billing", icon: <FaClipboardList />, path: "/billing" },
      ]
    },
    { category: "Finance", items: [ { title: "Fees", icon: <FaMoneyBill />, path: "/fees" } ] }
  ],

  faculty: [
    { category: "Main", items: [ { title: "Dashboard", icon: <FaHome />, path: "/dashboard" } ] },
    { category: "Teaching", items: [
        { title: "My Subjects", icon: <FaBook />, path: "/subjects" },
        { title: "Enter Marks", icon: <FaClipboardList />, path: "/marks" }
      ]
    },
    { category: "Students", items: [ { title: "Student List", icon: <FaUsers />, path: "/student-list" } ] }
  ],

  admin: [
    { category: "Main", items: [ { title: "Dashboard", icon: <FaHome />, path: "/dashboard" } ] },
    { category: "Management", items: [
        { title: "Students", icon: <FaUsers />, path: "/manage-students" },
        { title: "Faculty", icon: <FaChalkboardTeacher />, path: "/manage-faculty" }
      ]
    },
    { category: "System", items: [ { title: "Settings", icon: <FaCog />, path: "/settings" } ] }
  ]
};