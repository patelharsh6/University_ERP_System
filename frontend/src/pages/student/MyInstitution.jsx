// src/pages/student/MyInstitution.jsx
import React, { useState } from 'react';
import './MyInstitution.css';
import { FiEye, FiTarget, FiFileText, FiBell, FiBook, FiExternalLink, FiDownload, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const circulars = [
  {
    id: 1,
    category: 'Academic',
    name: '2025-26|EvenTerm|FEST-FOS|Academic Calendar',
    publishedOn: '29-Dec-2025',
    description: 'Official Academic Calendar for Even Term 2025-26 for Faculty of Science (FOS) including all important dates for examinations, holidays, and events.',
    attachment: 'EvenTerm-Academic-Calendar-FEST-FOS-2025-26.pdf',
  },
  {
    id: 2,
    category: 'Academic',
    name: '2025-26|EvenTerm|FEST-FOS|Examination Schedule',
    publishedOn: '05-Jan-2026',
    description: 'Detailed examination schedule for Even Term 2025-26. All students must adhere to the schedule and report to examination halls 30 minutes before the exam.',
    attachment: 'EvenTerm-Exam-Schedule-FOS-2025-26.pdf',
  },
  {
    id: 3,
    category: 'Administrative',
    name: '2025-26|EvenTerm|Fee Payment Reminder',
    publishedOn: '10-Jan-2026',
    description: 'Reminder for all students to clear their pending fee dues before 31st January 2026 to avoid late fee penalties.',
    attachment: 'FeePayment-Reminder-Jan-2026.pdf',
  },
  {
    id: 4,
    category: 'Event',
    name: '2025-26|EvenTerm|Annual Tech Fest Registration',
    publishedOn: '15-Jan-2026',
    description: 'Registration open for Annual Tech Fest 2026. All students are encouraged to participate in various technical and cultural events.',
    attachment: null,
  },
];

const noticeBoardItems = [
  {
    id: 1,
    category: 'Urgent',
    title: 'Library Book Return Deadline',
    date: '20-Jan-2026',
    content: 'All library books must be returned by 25th January 2026 to avoid penalty charges.',
    urgent: true,
  },
  {
    id: 2,
    category: 'General',
    title: 'Campus WiFi Maintenance',
    date: '18-Jan-2026',
    content: 'Campus WiFi will undergo scheduled maintenance on 22nd January 2026 from 10 PM to 2 AM.',
    urgent: false,
  },
  {
    id: 3,
    category: 'Academic',
    title: 'Guest Lecture: AI in Healthcare',
    date: '16-Jan-2026',
    content: 'An eminent industry expert will deliver a lecture on AI applications in Healthcare on 24th January 2026 at 3 PM in Auditorium Hall.',
    urgent: false,
  },
];

const curriculumSubjects = [
  { code: 'CS601', name: 'Machine Learning', credits: 4, semester: 'VI', type: 'Core' },
  { code: 'CS602', name: 'Cloud Computing', credits: 3, semester: 'VI', type: 'Core' },
  { code: 'CS603', name: 'Software Engineering', credits: 4, semester: 'VI', type: 'Core' },
  { code: 'CS604', name: 'Data Mining & Warehousing', credits: 3, semester: 'VI', type: 'Elective' },
  { code: 'CS605', name: 'Mobile Application Development', credits: 3, semester: 'VI', type: 'Elective' },
  { code: 'CS606', name: 'Project Work', credits: 6, semester: 'VI', type: 'Core' },
];

const TABS = ['Circular', 'Notice Board', 'Curriculum & Syllabus'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

const MyInstitution = () => {
  const [activeTab, setActiveTab] = useState('Circular');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <motion.div
      className="mi-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Title */}
      <motion.div className="mi-page-title" variants={itemVariants}>
        <h1>My Institution</h1>
      </motion.div>

      {/* Vision & Mission Cards */}
      <motion.div className="mi-vm-grid" variants={itemVariants}>
        <div className="mi-vm-card mi-vision-card">
          <div className="mi-vm-icon-wrap vision-icon">
            <FiEye />
          </div>
          <div>
            <h3 className="mi-vm-label">OUR VISION</h3>
            <p className="mi-vm-text">
              "To be a global multidisciplinary university advancing knowledge, innovation, and ethical leadership for sustainable societal progress and human well-being."
            </p>
          </div>
        </div>

        <div className="mi-vm-card mi-mission-card">
          <div className="mi-vm-icon-wrap mission-icon">
            <FiTarget />
          </div>
          <div>
            <h3 className="mi-vm-label">OUR MISSION</h3>
            <p className="mi-vm-text">
              "To deliver holistic, value-driven multidisciplinary education, advance impactful research, and apply knowledge through industry and societal engagement to address real-world challenges."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div className="mi-tabs-section" variants={itemVariants}>
        <div className="mi-tabs-bar">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`mi-tab-btn ${activeTab === tab ? 'mi-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && <motion.div className="mi-tab-underline" layoutId="tab-underline" />}
            </button>
          ))}
        </div>

        {/* Circular Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'Circular' && (
            <motion.div
              key="circular"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mi-tab-content"
            >
              <div className="mi-section-label">
                <FiFileText /> Policies &amp; Regulations
              </div>
              <div className="mi-circular-list">
                {circulars.map((item) => (
                  <div
                    key={item.id}
                    className={`mi-circular-card ${expandedId === item.id ? 'mi-expanded' : ''}`}
                  >
                    <div className="mi-circular-row mi-circular-row--header">
                      <span className="mi-circular-field-label">CATEGORY</span>
                      <span className="mi-circular-category-badge">{item.category}</span>
                    </div>
                    <div className="mi-circular-row">
                      <span className="mi-circular-field-label">NAME</span>
                      <span className="mi-circular-name">{item.name}</span>
                    </div>

                    <AnimatePresence>
                      {expandedId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mi-circular-expanded"
                        >
                          <div className="mi-circular-row">
                            <span className="mi-circular-field-label">PUBLISHED ON</span>
                            <span className="mi-circular-value">
                              <FiCalendar size={12} /> {item.publishedOn}
                            </span>
                          </div>
                          <div className="mi-circular-row">
                            <span className="mi-circular-field-label">DESCRIPTION</span>
                            <span className="mi-circular-value mi-desc-text">{item.description}</span>
                          </div>
                          <div className="mi-circular-row">
                            <span className="mi-circular-field-label">ATTACHMENT</span>
                            {item.attachment ? (
                              <a href="#download" className="mi-attachment-link">
                                <FiDownload size={12} /> {item.attachment}
                              </a>
                            ) : (
                              <span className="mi-circular-value">-</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      className="mi-expand-btn"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedId === item.id ? 'Show less' : 'Show more'}
                      <FiChevronRight
                        className={`mi-chevron ${expandedId === item.id ? 'mi-chevron-up' : ''}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notice Board Tab */}
          {activeTab === 'Notice Board' && (
            <motion.div
              key="notice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mi-tab-content"
            >
              <div className="mi-section-label">
                <FiBell /> Latest Notices
              </div>
              <div className="mi-notice-list">
                {noticeBoardItems.map((notice) => (
                  <div key={notice.id} className={`mi-notice-card ${notice.urgent ? 'mi-notice-urgent' : ''}`}>
                    <div className="mi-notice-top">
                      <div className="mi-notice-meta">
                        <span className={`mi-notice-badge ${notice.urgent ? 'badge-urgent' : 'badge-general'}`}>
                          {notice.category}
                        </span>
                        <span className="mi-notice-date">
                          <FiCalendar size={11} /> {notice.date}
                        </span>
                      </div>
                      <FiExternalLink className="mi-notice-link-icon" size={14} />
                    </div>
                    <h4 className="mi-notice-title">{notice.title}</h4>
                    <p className="mi-notice-content">{notice.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'Curriculum & Syllabus' && (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mi-tab-content"
            >
              <div className="mi-section-label">
                <FiBook /> Semester VI — B.Tech (CSE)
              </div>
              <div className="mi-curriculum-table-wrap">
                <table className="mi-curriculum-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Subject Name</th>
                      <th>Credits</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {curriculumSubjects.map((sub) => (
                      <tr key={sub.code}>
                        <td className="mi-sub-code">{sub.code}</td>
                        <td className="mi-sub-name">{sub.name}</td>
                        <td>
                          <span className="mi-credits-badge">{sub.credits}</span>
                        </td>
                        <td>
                          <span className={`mi-type-badge ${sub.type === 'Core' ? 'type-core' : 'type-elective'}`}>
                            {sub.type}
                          </span>
                        </td>
                        <td>
                          <button className="mi-syllabus-btn">
                            <FiDownload size={12} /> Syllabus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MyInstitution;
