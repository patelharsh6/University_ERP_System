// src/pages/student/Counselling.jsx
import React, { useState } from 'react';
import './Counselling.css';
import {
  FiHeart, FiCalendar, FiClock, FiUser, FiMessageSquare,
  FiCheckCircle, FiAlertCircle, FiPlus, FiStar, FiPhone,
  FiMail, FiMapPin, FiChevronRight, FiBookOpen, FiSmile,
  FiAlertTriangle, FiActivity, FiX
} from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const counsellors = [
  {
    id: 1,
    name: 'Dr. Priya Nair',
    title: 'Chief Student Counsellor',
    specialization: 'Academic Stress, Anxiety, Career Guidance',
    avatar: null,
    avatarColor: '#8b5cf6',
    initials: 'PN',
    rating: 4.9,
    sessions: 320,
    availability: 'Mon, Wed, Fri',
    timing: '10:00 AM – 4:00 PM',
    room: 'Room C-205',
    email: 'priya.nair@adani.edu',
    phone: '+91 98765 43210',
    bio: 'Dr. Priya Nair is a licensed psychologist with 12+ years of experience in academic counselling. She specializes in helping students manage stress, anxiety, and academic pressure with evidence-based CBT techniques.',
    tags: ['Anxiety', 'Stress', 'Career', 'Depression'],
    available: true,
  },
  {
    id: 2,
    name: 'Mr. Arjun Mehta',
    title: 'Academic & Career Counsellor',
    specialization: 'Career Planning, Study Skills, Motivation',
    avatar: null,
    avatarColor: '#2563eb',
    initials: 'AM',
    rating: 4.7,
    sessions: 215,
    availability: 'Tue, Thu, Sat',
    timing: '09:00 AM – 3:00 PM',
    room: 'Room C-207',
    email: 'arjun.mehta@adani.edu',
    phone: '+91 98765 11111',
    bio: 'Mr. Arjun Mehta is a certified career counsellor with expertise in helping students discover their professional path. He offers guidance on internships, placements, resume building, and interview preparation.',
    tags: ['Career', 'Motivation', 'Study Skills', 'Placements'],
    available: true,
  },
  {
    id: 3,
    name: 'Ms. Deepa Joshi',
    title: 'Mental Health & Wellness Counsellor',
    specialization: 'Depression, Relationship Issues, Self-esteem',
    avatar: null,
    avatarColor: '#ec4899',
    initials: 'DJ',
    rating: 4.8,
    sessions: 185,
    availability: 'Mon, Tue, Thu',
    timing: '11:00 AM – 5:00 PM',
    room: 'Room C-203',
    email: 'deepa.joshi@adani.edu',
    phone: '+91 98765 22222',
    bio: 'Ms. Deepa Joshi is a mental health advocate specializing in individual and group therapy. She creates a safe, non-judgmental space for students to express their feelings and find constructive solutions.',
    tags: ['Depression', 'Self-esteem', 'Relationships', 'Mindfulness'],
    available: false,
  },
];

const mySessions = [
  {
    id: 1,
    counsellorName: 'Dr. Priya Nair',
    date: '2026-07-08',
    displayDate: 'Tue, 8 Jul 2026',
    time: '11:00 AM',
    duration: '45 min',
    mode: 'In-Person',
    reason: 'Academic stress management',
    status: 'upcoming',
    notes: 'Bring your semester timetable',
  },
  {
    id: 2,
    counsellorName: 'Mr. Arjun Mehta',
    date: '2026-06-20',
    displayDate: 'Sat, 20 Jun 2026',
    time: '10:00 AM',
    duration: '60 min',
    mode: 'In-Person',
    reason: 'Career guidance and internship planning',
    status: 'completed',
    notes: 'Discussed GATE prep vs. placements',
    feedback: 5,
  },
  {
    id: 3,
    counsellorName: 'Dr. Priya Nair',
    date: '2026-06-05',
    displayDate: 'Fri, 5 Jun 2026',
    time: '02:00 PM',
    duration: '45 min',
    mode: 'Online',
    reason: 'Exam anxiety and focus techniques',
    status: 'completed',
    notes: 'Mindfulness exercises recommended',
    feedback: 5,
  },
];

const resources = [
  { id: 1, title: 'Managing Exam Stress', category: 'Stress',    icon: '📖', desc: 'Practical techniques to stay calm before and during exams.', link: '#' },
  { id: 2, title: 'Dealing with Homesickness', category: 'Wellbeing', icon: '🏠', desc: 'Tips for adapting to life away from home as a student.', link: '#' },
  { id: 3, title: 'Time Management Guide', category: 'Productivity', icon: '⏰', desc: 'Proven strategies for balancing studies, hobbies, and rest.', link: '#' },
  { id: 4, title: 'Sleep & Academic Performance', category: 'Health', icon: '😴', desc: 'Why sleep quality directly impacts your grades and memory.', link: '#' },
  { id: 5, title: 'Career Planning 101', category: 'Career', icon: '🚀', desc: 'Step-by-step guide from self-assessment to job offer.', link: '#' },
  { id: 6, title: 'Mindfulness for Students', category: 'Wellbeing', icon: '🧘', desc: 'Daily mindfulness practices to reduce anxiety and improve focus.', link: '#' },
];

const wellbeingData = {
  mood: 72,
  stress: 38,
  focus: 80,
  sleep: 65,
};

// ─── Mini Avatar ───────────────────────────────────────────────────────────────
const CAvatar = ({ c, size = 52 }) => (
  <div
    className="c-avatar"
    style={{
      width: size, height: size,
      background: `linear-gradient(135deg, ${c.avatarColor}cc, ${c.avatarColor})`,
      fontSize: size * 0.34,
    }}
  >
    {c.initials}
  </div>
);

// ─── Book Appointment Modal ────────────────────────────────────────────────────
const BookModal = ({ counsellor, onClose }) => {
  const [form, setForm] = useState({ date: '', time: '', reason: '', mode: 'In-Person' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="c-modal-overlay" onClick={onClose}>
      <div className="c-modal" onClick={e => e.stopPropagation()}>
        <div className="c-modal-header">
          <button className="c-modal-close" onClick={onClose}><FiX size={16} /></button>
          <h3>Book Appointment</h3>
          <p>with <strong>{counsellor.name}</strong></p>
        </div>

        {submitted ? (
          <div className="c-modal-success">
            <div className="success-icon"><FiCheckCircle size={40} /></div>
            <h3>Appointment Requested!</h3>
            <p>You'll receive a confirmation email at your university ID shortly.</p>
            <button className="c-btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="c-modal-form" onSubmit={handleSubmit}>
            <div className="c-form-group">
              <label>Preferred Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required min="2026-07-05" />
            </div>
            <div className="c-form-group">
              <label>Preferred Time</label>
              <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required>
                <option value="">Select a time slot</option>
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:00 PM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
              </select>
            </div>
            <div className="c-form-group">
              <label>Mode</label>
              <div className="mode-toggle">
                {['In-Person', 'Online'].map(m => (
                  <button
                    key={m}
                    type="button"
                    className={form.mode === m ? 'active' : ''}
                    onClick={() => setForm({ ...form, mode: m })}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="c-form-group">
              <label>Brief Reason / Concern</label>
              <textarea
                rows={3}
                placeholder="Briefly describe what you'd like to discuss…"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="c-btn-primary">
              <FiCalendar size={14} /> Request Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Counselling = () => {
  const [activeTab, setActiveTab] = useState('counsellors');
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);

  const tabs = [
    { id: 'counsellors', label: 'Counsellors', icon: FiUser },
    { id: 'sessions', label: 'My Sessions', icon: FiCalendar },
    { id: 'resources', label: 'Self Help', icon: FiBookOpen },
    { id: 'wellbeing', label: 'Wellbeing Check', icon: FiActivity },
  ];

  return (
    <div className="counselling-page">

      {/* ── HEADER ── */}
      <div className="counselling-header">
        <div className="c-title-group">
          <div className="c-header-icon"><FiHeart size={22} /></div>
          <div>
            <h1 className="c-title">Student Counselling</h1>
            <p className="c-subtitle">Mental health, academic support & career guidance</p>
          </div>
        </div>
        <div className="c-crisis-line">
          <FiAlertTriangle size={14} />
          <span>Crisis Line: </span>
          <a href="tel:+918000000000"><strong>1800-XXX-XXXX</strong></a>
          <span>(24/7)</span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="c-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`c-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: COUNSELLORS ── */}
      {activeTab === 'counsellors' && (
        <div className="counsellors-tab">
          <div className="counsellors-grid">
            {counsellors.map(c => (
              <div key={c.id} className={`counsellor-card ${!c.available ? 'unavailable' : ''}`}>
                <div className="counsellor-card-top">
                  <CAvatar c={c} size={56} />
                  <div className="c-avail-tag" style={{ background: c.available ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: c.available ? '#10b981' : '#9ca3af' }}>
                    {c.available ? '● Available' : '○ Busy'}
                  </div>
                </div>

                <h3 className="c-name">{c.name}</h3>
                <p className="c-title-text">{c.title}</p>
                <p className="c-spec">{c.specialization}</p>

                <div className="c-tags">
                  {c.tags.map(t => (
                    <span key={t} className="c-tag">{t}</span>
                  ))}
                </div>

                <div className="c-stats">
                  <div className="c-stat">
                    <FiStar size={12} />
                    <span>{c.rating}/5.0</span>
                  </div>
                  <div className="c-stat">
                    <FiUser size={12} />
                    <span>{c.sessions}+ sessions</span>
                  </div>
                  <div className="c-stat">
                    <FiClock size={12} />
                    <span>{c.availability}</span>
                  </div>
                </div>

                <div className="c-card-actions">
                  <button className="c-btn-outline" onClick={() => setSelectedCounsellor(c)}>
                    View Profile
                  </button>
                  <button
                    className="c-btn-primary"
                    disabled={!c.available}
                    onClick={() => c.available && setBookingFor(c)}
                  >
                    <FiCalendar size={13} /> Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: MY SESSIONS ── */}
      {activeTab === 'sessions' && (
        <div className="sessions-tab">
          <div className="sessions-header-row">
            <h2>My Appointments</h2>
            <button className="c-btn-primary small" onClick={() => setActiveTab('counsellors')}>
              <FiPlus size={13} /> New Appointment
            </button>
          </div>
          <div className="sessions-list">
            {mySessions.map(s => (
              <div key={s.id} className={`session-card ${s.status}`}>
                <div className="session-status-bar" />
                <div className="session-body">
                  <div className="session-top">
                    <div>
                      <span className={`session-badge ${s.status}`}>
                        {s.status === 'upcoming' ? '🗓 Upcoming' : '✅ Completed'}
                      </span>
                      <h3 className="session-counsellor">{s.counsellorName}</h3>
                      <p className="session-reason">{s.reason}</p>
                    </div>
                    <div className="session-meta">
                      <div className="session-meta-item"><FiCalendar size={13} />{s.displayDate}</div>
                      <div className="session-meta-item"><FiClock size={13} />{s.time} · {s.duration}</div>
                      <div className="session-meta-item"><FiMapPin size={13} />{s.mode}</div>
                    </div>
                  </div>
                  {s.notes && (
                    <div className="session-notes">
                      <FiMessageSquare size={12} /> <em>"{s.notes}"</em>
                    </div>
                  )}
                  {s.feedback && (
                    <div className="session-feedback">
                      {'⭐'.repeat(s.feedback)} Rated {s.feedback}/5
                    </div>
                  )}
                  {s.status === 'upcoming' && (
                    <div className="session-actions">
                      <button className="c-btn-outline small">Reschedule</button>
                      <button className="c-btn-danger small">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: RESOURCES ── */}
      {activeTab === 'resources' && (
        <div className="resources-tab">
          <h2 className="resources-heading">Self-Help Resources</h2>
          <p className="resources-sub">Curated articles and guides for student wellbeing</p>
          <div className="resources-grid">
            {resources.map(r => (
              <div key={r.id} className="resource-card">
                <div className="resource-emoji">{r.icon}</div>
                <span className="resource-cat">{r.category}</span>
                <h3 className="resource-title">{r.title}</h3>
                <p className="resource-desc">{r.desc}</p>
                <button className="resource-btn">
                  Read More <FiChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: WELLBEING ── */}
      {activeTab === 'wellbeing' && (
        <div className="wellbeing-tab">
          <h2 className="wellbeing-heading">Your Wellbeing Dashboard</h2>
          <p className="wellbeing-sub">Based on your recent check-in. Last updated: Today</p>

          <div className="wellbeing-meters">
            {[
              { key: 'mood',   label: 'Overall Mood',    val: wellbeingData.mood,   color: '#10b981', icon: '😊' },
              { key: 'stress', label: 'Stress Level',    val: wellbeingData.stress, color: '#ef4444', icon: '😓', inverted: true },
              { key: 'focus',  label: 'Focus & Clarity', val: wellbeingData.focus,  color: '#2563eb', icon: '🎯' },
              { key: 'sleep',  label: 'Sleep Quality',   val: wellbeingData.sleep,  color: '#8b5cf6', icon: '💤' },
            ].map(m => {
              const displayVal = m.inverted ? 100 - m.val : m.val;
              const level = displayVal >= 70 ? 'Good' : displayVal >= 40 ? 'Moderate' : 'Low';
              return (
                <div key={m.key} className="wellbeing-meter">
                  <div className="wm-top">
                    <span className="wm-icon">{m.icon}</span>
                    <span className="wm-label">{m.label}</span>
                    <span className="wm-val" style={{ color: m.color }}>{displayVal}%</span>
                  </div>
                  <div className="wm-bar-bg">
                    <div
                      className="wm-bar-fill"
                      style={{ width: `${displayVal}%`, background: m.color }}
                    />
                  </div>
                  <div className="wm-level" style={{ color: m.color }}>{level}</div>
                </div>
              );
            })}
          </div>

          <div className="wellbeing-tip">
            <FiSmile size={18} />
            <div>
              <strong>Today's Tip:</strong>
              <p>Take a 5-minute walk between study sessions. Physical movement significantly boosts dopamine and enhances focus for the next 2 hours.</p>
            </div>
          </div>

          <button className="c-btn-primary" style={{ marginTop: '8px' }}>
            <FiActivity size={14} /> Take Full Wellbeing Assessment
          </button>
        </div>
      )}

      {/* ── COUNSELLOR PROFILE MODAL ── */}
      {selectedCounsellor && (
        <div className="c-modal-overlay" onClick={() => setSelectedCounsellor(null)}>
          <div className="c-modal profile-modal" onClick={e => e.stopPropagation()}>
            <button className="c-modal-close" onClick={() => setSelectedCounsellor(null)}><FiX size={16} /></button>
            <div className="profile-modal-top">
              <CAvatar c={selectedCounsellor} size={70} />
              <div>
                <h2>{selectedCounsellor.name}</h2>
                <p className="c-title-text">{selectedCounsellor.title}</p>
                <div className="c-stats" style={{ marginTop: '8px' }}>
                  <div className="c-stat"><FiStar size={12} />{selectedCounsellor.rating}/5.0</div>
                  <div className="c-stat"><FiUser size={12} />{selectedCounsellor.sessions}+ sessions</div>
                </div>
              </div>
            </div>
            <p className="profile-bio">{selectedCounsellor.bio}</p>
            <div className="profile-contact">
              <div><FiCalendar size={13} /> {selectedCounsellor.availability}</div>
              <div><FiClock size={13} /> {selectedCounsellor.timing}</div>
              <div><FiMapPin size={13} /> {selectedCounsellor.room}</div>
              <div><FiMail size={13} /> {selectedCounsellor.email}</div>
              <div><FiPhone size={13} /> {selectedCounsellor.phone}</div>
            </div>
            <button
              className="c-btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={!selectedCounsellor.available}
              onClick={() => { setSelectedCounsellor(null); setBookingFor(selectedCounsellor); }}
            >
              <FiCalendar size={14} /> Book Appointment
            </button>
          </div>
        </div>
      )}

      {/* ── BOOK APPOINTMENT MODAL ── */}
      {bookingFor && <BookModal counsellor={bookingFor} onClose={() => setBookingFor(null)} />}

    </div>
  );
};

export default Counselling;
