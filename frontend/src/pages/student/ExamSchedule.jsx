// src/pages/student/ExamSchedule.jsx
import React, { useState, useEffect } from 'react';
import './ExamSchedule.css';
import {
  FiCalendar, FiClock, FiMapPin, FiBook, FiDownload,
  FiAlertCircle, FiCheckCircle, FiSearch,
  FiChevronRight, FiAward, FiFileText, FiInfo
} from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const commonExamInfo = {
  semester: 'Semester VI',
  batch: 'CE – 2023–2027',
  venue: 'Adani University – Main Campus',
  reportingTime: '08:45 AM',
  examStartTime: '09:00 AM',
  instructions: [
    'Carry your University ID card and Hall Ticket to the exam hall.',
    'No electronic devices (mobile phones, smartwatches, calculators unless specified) are allowed.',
    'Students must report 15 minutes before the exam start time.',
    'Blank answer sheets will be provided. Use a blue or black pen only.',
    'Malpractice will lead to immediate disqualification.',
  ],
};

const examSessionsList = [
  { id: 'mid', name: 'Mid-Semester Examinations', session: 'Winter 2026' },
  { id: 'final', name: 'Final Examinations', session: 'Winter 2026' },
];

const allExams = [
  // Mid Sem Exams
  { id: 1, sessionId: 'mid', code: 'CE601', subject: 'Database Management Systems', shortName: 'DBMS', date: '2026-07-15', displayDate: 'Tue, 15 Jul 2026', day: 'Tuesday', time: '09:00 AM – 10:30 AM', duration: '1.5 Hours', room: 'Room 304', block: 'A Block', seat: 'A-24', faculty: 'Dr. Rajesh Sharma', credits: 4, type: 'Theory', color: '#2563eb' },
  { id: 2, sessionId: 'mid', code: 'CE602', subject: 'Artificial Intelligence', shortName: 'AI', date: '2026-07-17', displayDate: 'Thu, 17 Jul 2026', day: 'Thursday', time: '09:00 AM – 10:30 AM', duration: '1.5 Hours', room: 'Room 204', block: 'B Block', seat: 'B-11', faculty: 'Prof. Anita Verma', credits: 4, type: 'Theory', color: '#0d9488' },
  { id: 3, sessionId: 'mid', code: 'CE603', subject: 'Computer Networks', shortName: 'CN', date: '2026-07-19', displayDate: 'Sat, 19 Jul 2026', day: 'Saturday', time: '09:00 AM – 10:30 AM', duration: '1.5 Hours', room: 'Room 202', block: 'A Block', seat: 'A-07', faculty: 'Dr. Sanjay Gupta', credits: 4, type: 'Theory', color: '#8b5cf6' },
  // Final Exams
  { id: 4, sessionId: 'final', code: 'CE601', subject: 'Database Management Systems', shortName: 'DBMS', date: '2026-11-20', displayDate: 'Fri, 20 Nov 2026', day: 'Friday', time: '09:00 AM – 12:00 PM', duration: '3 Hours', room: 'Room 304', block: 'A Block', seat: 'A-24', faculty: 'Dr. Rajesh Sharma', credits: 4, type: 'Theory', color: '#2563eb' },
  { id: 5, sessionId: 'final', code: 'CE602', subject: 'Artificial Intelligence', shortName: 'AI', date: '2026-11-23', displayDate: 'Mon, 23 Nov 2026', day: 'Monday', time: '09:00 AM – 12:00 PM', duration: '3 Hours', room: 'Room 204', block: 'B Block', seat: 'B-11', faculty: 'Prof. Anita Verma', credits: 4, type: 'Theory', color: '#0d9488' },
  { id: 6, sessionId: 'final', code: 'CE603', subject: 'Computer Networks', shortName: 'CN', date: '2026-11-25', displayDate: 'Wed, 25 Nov 2026', day: 'Wednesday', time: '09:00 AM – 12:00 PM', duration: '3 Hours', room: 'Room 202', block: 'A Block', seat: 'A-07', faculty: 'Dr. Sanjay Gupta', credits: 4, type: 'Theory', color: '#8b5cf6' },
  { id: 7, sessionId: 'final', code: 'CE604', subject: 'Software Engineering', shortName: 'SE', date: '2026-11-28', displayDate: 'Sat, 28 Nov 2026', day: 'Saturday', time: '09:00 AM – 12:00 PM', duration: '3 Hours', room: 'Room 101', block: 'C Block', seat: 'C-33', faculty: 'Prof. Meera Desai', credits: 4, type: 'Theory', color: '#f59e0b' },
  { id: 8, sessionId: 'final', code: 'CE601P', subject: 'DBMS Lab', shortName: 'DBMS Lab', date: '2026-11-10', displayDate: 'Tue, 10 Nov 2026', day: 'Tuesday', time: '09:00 AM – 12:00 PM', duration: '3 Hours', room: 'DB Lab 1', block: 'Lab Block', seat: 'PC-08', faculty: 'Dr. Rajesh Sharma', credits: 2, type: 'Practical', color: '#2563eb' },
];

// ─── Exam Card ─────────────────────────────────────────────────────────────────
const ExamCard = ({ exam, onClick }) => {
  return (
    <div
      className="exam-card"
      style={{ '--exam-color': exam.color }}
      onClick={() => onClick(exam)}
    >
      <div className="exam-card-accent" />
      <div className="exam-card-body">
        {/* Subject */}
        <div className="exam-subject-row">
          <span className="exam-code" style={{ color: exam.color }}>{exam.code}</span>
          <h3 className="exam-subject">{exam.subject}</h3>
        </div>

        {/* Meta Grid */}
        <div className="exam-meta-grid">
          <div className="exam-meta-item">
            <FiCalendar size={13} />
            <span>{exam.displayDate}</span>
          </div>
          <div className="exam-meta-item">
            <FiClock size={13} />
            <span>{exam.time}</span>
          </div>
          <div className="exam-meta-item">
            <FiMapPin size={13} />
            <span>{exam.room}, {exam.block}</span>
          </div>
          <div className="exam-meta-item">
            <FiAward size={13} />
            <span>Seat: <strong>{exam.seat}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ExamSchedule = () => {
  const [activeSessionId, setActiveSessionId] = useState('mid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);

  const activeSessionObj = examSessionsList.find(s => s.id === activeSessionId);
  const filters = ['All', 'Theory', 'Practical'];

  // Filter exams by session first, then by user filters
  const sessionExams = allExams.filter(e => e.sessionId === activeSessionId);
  
  const filtered = sessionExams.filter(e => {
    const matchFilter = activeFilter === 'All' || e.type === activeFilter;
    const matchSearch = !searchQuery ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Sort by date
  const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="exam-schedule-page">

      {/* ── HEADER ── */}
      <div className="exam-page-header">
        <div className="exam-header-left">
          <div className="exam-header-icon"><FiCalendar size={22} /></div>
          <div>
            <h1 className="exam-page-title">Exam Schedule</h1>
            <p className="exam-page-sub">{commonExamInfo.batch} · {activeSessionObj.session}</p>
          </div>
        </div>
        <div className="exam-header-right">
          <button className="exam-download-btn">
            <FiDownload size={14} /> Hall Ticket
          </button>
        </div>
      </div>

      {/* ── EXAM SESSION SELECTOR ── */}
      <div className="exam-session-selector">
        {examSessionsList.map(session => (
          <button
            key={session.id}
            className={`session-tab ${activeSessionId === session.id ? 'active' : ''}`}
            onClick={() => { setActiveSessionId(session.id); setActiveFilter('All'); }}
          >
            {session.name}
          </button>
        ))}
      </div>

      {/* ── CONTROLS ── */}
      <div className="exam-controls">
        <div className="exam-search">
          <FiSearch size={14} />
          <input
            type="text"
            placeholder="Search subject or code…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="exam-filter-chips">
          {filters.map(f => (
            <button
              key={f}
              className={`exam-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="exam-cards-grid">
        {sorted.map(exam => (
          <ExamCard key={exam.id} exam={exam} onClick={setSelectedExam} />
        ))}
        {sorted.length === 0 && <p style={{color:'var(--text-secondary)'}}>No exams found for the selected filter.</p>}
      </div>

      {/* ── INSTRUCTIONS BOX ── */}
      <div className="exam-instructions">
        <div className="instr-header">
          <FiInfo size={16} /> Important Instructions
        </div>
        <ul className="instr-list">
          {commonExamInfo.instructions.map((instr, i) => (
            <li key={i}><FiCheckCircle size={13} className="instr-check" />{instr}</li>
          ))}
        </ul>
        <div className="instr-footer">
          <span>📍 {commonExamInfo.venue}</span>
          <span>⏰ Report by {commonExamInfo.reportingTime}</span>
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedExam && (
        <div className="exam-modal-overlay" onClick={() => setSelectedExam(null)}>
          <div className="exam-modal" onClick={e => e.stopPropagation()}>
            <div className="exam-modal-header" style={{ background: `linear-gradient(135deg, ${selectedExam.color}18, ${selectedExam.color}08)`, borderBottom: `3px solid ${selectedExam.color}` }}>
              <button className="exam-modal-close" onClick={() => setSelectedExam(null)}>✕</button>
              <div className="exam-modal-type" style={{ color: selectedExam.color }}>
                {selectedExam.code} · {selectedExam.type}
              </div>
              <h2 className="exam-modal-subject">{selectedExam.subject}</h2>
            </div>
            <div className="exam-modal-body">
              <div className="exam-modal-grid">
                <div className="exam-modal-item">
                  <FiCalendar size={16} className="modal-item-icon" />
                  <div>
                    <label>Date & Day</label>
                    <strong>{selectedExam.displayDate} ({selectedExam.day})</strong>
                  </div>
                </div>
                <div className="exam-modal-item">
                  <FiClock size={16} className="modal-item-icon" />
                  <div>
                    <label>Timing</label>
                    <strong>{selectedExam.time} ({selectedExam.duration})</strong>
                  </div>
                </div>
                <div className="exam-modal-item">
                  <FiMapPin size={16} className="modal-item-icon" />
                  <div>
                    <label>Exam Room</label>
                    <strong>{selectedExam.room}, {selectedExam.block}</strong>
                  </div>
                </div>
                <div className="exam-modal-item">
                  <FiAward size={16} className="modal-item-icon" />
                  <div>
                    <label>Your Seat</label>
                    <strong style={{ color: selectedExam.color, fontSize: '1.1rem' }}>{selectedExam.seat}</strong>
                  </div>
                </div>
                <div className="exam-modal-item">
                  <FiBook size={16} className="modal-item-icon" />
                  <div>
                    <label>Faculty</label>
                    <strong>{selectedExam.faculty}</strong>
                  </div>
                </div>
                <div className="exam-modal-item">
                  <FiFileText size={16} className="modal-item-icon" />
                  <div>
                    <label>Credits</label>
                    <strong>{selectedExam.credits} Credits</strong>
                  </div>
                </div>
              </div>
              <button className="exam-modal-dl-btn">
                <FiDownload size={14} /> Download Hall Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExamSchedule;
