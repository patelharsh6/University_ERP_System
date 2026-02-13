// src/pages/Feedback.jsx
import React, { useState } from 'react';
import './Feedback.css';
import { FaStar, FaChalkboardTeacher, FaCheckCircle, FaUserSecret } from 'react-icons/fa';

const Feedback = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // --- MOCK DATA ---
  const pendingFeedback = [
    { id: 1, subject: "Data Structures", code: "CS101", faculty: "Prof. Sharma", type: "Mid-Sem Review", status: "pending" },
    { id: 2, subject: "Database Mgmt", code: "CS102", faculty: "Prof. Verma", type: "Mid-Sem Review", status: "pending" },
  ];

  const completedFeedback = [
    { id: 3, subject: "Operating Systems", code: "CS201", faculty: "Prof. Gupta", type: "Final Review", status: "submitted" },
  ];

  // --- FORM STATE ---
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Handle Opening Form
  const handleOpenForm = (subject) => {
    setSelectedSubject(subject);
    setView('form');
    setRatings({}); // Reset form
    setComment('');
  };

  // Handle Star Click
  const handleRate = (questionId, value) => {
    setRatings({ ...ratings, [questionId]: value });
  };

  // Submit Handler
  const handleSubmit = () => {
    alert("Feedback Submitted Successfully!");
    setView('list');
  };

  return (
    <div className="feedback-container">
      
      {/* 🟢 VIEW 1: FEEDBACK LIST */}
      {view === 'list' && (
        <>
          <div className="feedback-header">
            <h2>Faculty Feedback</h2>
            <p style={{ color: '#64748B' }}>Share your honest feedback to help us improve.</p>
          </div>

          <div className="feedback-tabs">
            <button 
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({pendingFeedback.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>

          <div className="feedback-grid">
            {(activeTab === 'pending' ? pendingFeedback : completedFeedback).map((item) => (
              <div key={item.id} className={`feedback-card status-${item.status}`}>
                <div>
                  <div className="card-header">
                    <div>
                      <div className="subject-name">{item.subject}</div>
                      <div className="subject-code">{item.code}</div>
                    </div>
                  </div>
                  
                  <div className="faculty-name">
                    <FaChalkboardTeacher /> {item.faculty}
                  </div>
                  <div className="review-badge">{item.type}</div>
                </div>

                <div className="card-action">
                  {item.status === 'pending' ? (
                    <button className="btn-give-feedback" onClick={() => handleOpenForm(item)}>
                      Give Feedback
                    </button>
                  ) : (
                    <button className="btn-view-feedback">
                      View Submission
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 📝 VIEW 2: FEEDBACK FORM */}
      {view === 'form' && selectedSubject && (
        <div className="form-container">
          
          {/* Header Info Card */}
          <div className="faculty-info-card">
            <div className="faculty-avatar">
              {selectedSubject.faculty.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#0F172A' }}>{selectedSubject.subject}</h3>
              <p style={{ color: '#64748B', margin: '4px 0' }}>{selectedSubject.faculty}</p>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{selectedSubject.type}</div>
            </div>
          </div>

          {/* GROUP 1: TEACHING QUALITY */}
          <div className="rating-group">
            <div className="group-title">📘 Teaching Quality</div>
            
            <RatingQuestion 
              id="q1" 
              text="Does the faculty explain concepts clearly?" 
              value={ratings.q1} 
              onRate={handleRate} 
            />
            <RatingQuestion 
              id="q2" 
              text="Is the faculty punctual and regular?" 
              value={ratings.q2} 
              onRate={handleRate} 
            />
          </div>

          {/* GROUP 2: SUPPORT */}
          <div className="rating-group">
            <div className="group-title">🤝 Support & Guidance</div>
            
            <RatingQuestion 
              id="q3" 
              text="Is the faculty available for clearing doubts?" 
              value={ratings.q3} 
              onRate={handleRate} 
            />
             <RatingQuestion 
              id="q4" 
              text="Does the faculty encourage questions?" 
              value={ratings.q4} 
              onRate={handleRate} 
            />
          </div>

          {/* COMMENTS */}
          <div className="comment-section">
            <h4 style={{ margin: 0, color: '#334155' }}>Additional Comments (Optional)</h4>
            <textarea 
              className="comment-input" 
              placeholder="Share your experience..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <div className="char-count">{comment.length} / 500</div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="form-actions">
            <label className="anonymous-toggle">
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={() => setIsAnonymous(!isAnonymous)} 
              />
              <FaUserSecret /> Submit Anonymously
            </label>

            <div>
              <button className="btn-cancel" onClick={() => setView('list')}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>Submit Feedback</button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

// Helper Component for Star Logic
const RatingQuestion = ({ id, text, value = 0, onRate }) => {
  return (
    <div className="rating-item">
      <div className="question-text">{text}</div>
      <div className="star-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            className={`star-btn ${star <= value ? 'active' : ''}`}
            onClick={() => onRate(id, star)}
          >
            <FaStar />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Feedback;