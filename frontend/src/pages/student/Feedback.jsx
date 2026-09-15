// src/pages/student/Feedback.jsx
import React, { useState, useMemo } from 'react';
import './Feedback.css';
import { 
  FiStar, FiUser, FiCheckCircle, FiShield, 
  FiMessageSquare, FiBookOpen, FiInbox, FiX 
} from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { useMutation } from '../../hooks/useMutation';
import { useToast } from '../../context/ToastContext';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const Feedback = () => {
  const [view, setView] = useState('list'); // 'list', 'form', or 'detail'
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);

  const toast = useToast();

  // Fetch student's course enrollments
  const { 
    data: enrollmentsData, 
    loading: loadingEnrollments, 
    error: errorEnrollments, 
    refetch: refetchEnrollments 
  } = useApi(endpoints.courses.enrollments, { params: { page_size: 100 } });

  // Fetch all existing feedbacks submitted by this student
  const { 
    data: feedbackData, 
    loading: loadingFeedback, 
    error: errorFeedback, 
    refetch: refetchFeedback 
  } = useApi(endpoints.feedback.list, { params: { page_size: 100 } });

  const { mutate: submitFeedback, submitting } = useMutation(endpoints.feedback.list, {
    method: 'POST',
  });

  const rawEnrollments = useMemo(() => {
    return Array.isArray(enrollmentsData) 
      ? enrollmentsData 
      : (enrollmentsData?.results || []);
  }, [enrollmentsData]);

  const rawFeedbacks = useMemo(() => {
    return Array.isArray(feedbackData) 
      ? feedbackData 
      : (feedbackData?.results || []);
  }, [feedbackData]);

  // Map feedbacks by course ID
  const feedbackByCourse = useMemo(() => {
    const map = new Map();
    rawFeedbacks.forEach(fb => {
      const courseId = typeof fb.course === 'object' ? fb.course?.id : fb.course;
      if (courseId) {
        map.set(courseId, fb);
      }
    });
    return map;
  }, [rawFeedbacks]);

  // Combine enrolled courses into pending and completed lists
  const { pendingFeedback, completedFeedback } = useMemo(() => {
    const pending = [];
    const completed = [];

    rawEnrollments.forEach(enroll => {
      const course = enroll.course || {};
      const courseId = course.id || enroll.id;
      const fb = feedbackByCourse.get(courseId);

      const facultyName = course.instructor_name || 
        (course.instructor ? `${course.instructor.first_name || ''} ${course.instructor.last_name || ''}`.trim() : 'Faculty Member');

      const item = {
        id: enroll.id,
        courseId: courseId,
        instructorId: course.instructor?.id || course.instructor || null,
        subject: course.title || enroll.course_code || 'Course Subject',
        code: course.code || enroll.course_code || 'CRS',
        faculty: facultyName,
        type: enroll.term_name || 'Semester Course Feedback',
        status: fb ? 'submitted' : 'pending',
        feedback: fb,
      };

      if (fb) {
        completed.push(item);
      } else {
        pending.push(item);
      }
    });

    return { pendingFeedback: pending, completedFeedback: completed };
  }, [rawEnrollments, feedbackByCourse]);

  // --- FORM STATE ---
  const [ratings, setRatings] = useState({
    q1: 0, // Teaching Quality
    q2: 0, // Course Content
    q3: 0, // Communication
    q4: 0, // Overall Rating
  });
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Handle Opening Form
  const handleOpenForm = (subject) => {
    setSelectedSubject(subject);
    setView('form');
    setRatings({ q1: 0, q2: 0, q3: 0, q4: 0 });
    setComment('');
    setIsAnonymous(false);
  };

  // Handle Star Click
  const handleRate = (questionId, value) => {
    setRatings(prev => ({ ...prev, [questionId]: value }));
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!ratings.q1 || !ratings.q2 || !ratings.q3 || !ratings.q4) {
      toast.warning('Please provide a rating for all evaluation criteria.');
      return;
    }

    const payload = {
      course: selectedSubject.courseId,
      instructor: selectedSubject.instructorId,
      teaching_quality: ratings.q1,
      course_content: ratings.q2,
      communication: ratings.q3,
      overall_rating: ratings.q4,
      comments: comment.trim(),
      is_anonymous: isAnonymous,
    };

    try {
      await submitFeedback(payload);
      toast.success('Feedback Submitted Successfully!');
      setView('list');
      await Promise.all([refetchEnrollments(), refetchFeedback()]);
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback.');
    }
  };

  const loading = loadingEnrollments || loadingFeedback;
  const error = errorEnrollments || errorFeedback;

  return (
    <div className="feedback-container">
      
      {/* 🟢 VIEW 1: FEEDBACK LIST */}
      {view === 'list' && (
        <>
          <div className="feedback-header">
            <h1><FiMessageSquare style={{ color: 'var(--fb-accent)' }} /> Faculty Feedback</h1>
            <p>Share your honest feedback to help us improve teaching standards.</p>
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
              Completed ({completedFeedback.length})
            </button>
          </div>

          {loading ? (
            <div className="feedback-grid">
              <Skeleton height="160px" borderRadius="12px" />
              <Skeleton height="160px" borderRadius="12px" />
              <Skeleton height="160px" borderRadius="12px" />
            </div>
          ) : error ? (
            <ErrorState 
              message="Failed to load feedback records. Please try again." 
              onRetry={() => { refetchEnrollments(); refetchFeedback(); }} 
            />
          ) : (
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
                      <FiUser /> {item.faculty}
                    </div>
                    <div className="review-badge">{item.type}</div>
                  </div>

                  <div className="card-action">
                    {item.status === 'pending' ? (
                      <button className="btn-give-feedback" onClick={() => handleOpenForm(item)}>
                        Give Feedback
                      </button>
                    ) : (
                      <button className="btn-view-feedback" onClick={() => setViewingFeedback(item)}>
                        <FiCheckCircle /> View Submission
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {(activeTab === 'pending' ? pendingFeedback : completedFeedback).length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--fb-text-muted)' }}>
                  <FiInbox style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '12px' }} />
                  <h3 style={{ margin: '0 0 6px 0', color: 'var(--fb-text-primary)' }}>
                    No {activeTab} feedback
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    {activeTab === 'pending' 
                      ? 'You have completed all pending course reviews!' 
                      : 'No submitted feedback records found.'}
                  </p>
                </div>
              )}
            </div>
          )}
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
              <h3 style={{ margin: 0, fontFamily: 'Sora', color: 'var(--fb-text-primary)' }}>{selectedSubject.subject}</h3>
              <p style={{ color: 'var(--fb-text-secondary)', margin: '4px 0', fontWeight: '600' }}>{selectedSubject.faculty}</p>
              <div style={{ fontSize: '13px', color: 'var(--fb-text-muted)' }}>{selectedSubject.type}</div>
            </div>
          </div>

          {/* GROUP 1: TEACHING QUALITY */}
          <div className="rating-group">
            <div className="group-title"><FiBookOpen /> Teaching Quality & Delivery</div>
            
            <RatingQuestion 
              id="q1" 
              text="Does the faculty explain concepts clearly and effectively?" 
              value={ratings.q1} 
              onRate={handleRate} 
            />
            <RatingQuestion 
              id="q2" 
              text="Is the course content organized, up-to-date, and relevant?" 
              value={ratings.q2} 
              onRate={handleRate} 
            />
          </div>

          {/* GROUP 2: SUPPORT & COMMUNICATION */}
          <div className="rating-group">
            <div className="group-title"><FiMessageSquare /> Support, Communication & Overall</div>
            
            <RatingQuestion 
              id="q3" 
              text="Is the faculty responsive to questions and accessible for guidance?" 
              value={ratings.q3} 
              onRate={handleRate} 
            />
            <RatingQuestion 
              id="q4" 
              text="Overall satisfaction with this course and instructor?" 
              value={ratings.q4} 
              onRate={handleRate} 
            />
          </div>

          {/* COMMENTS */}
          <div className="comment-section">
            <h4 style={{ margin: 0, fontFamily: 'Sora', color: 'var(--fb-text-primary)' }}>Additional Comments (Optional)</h4>
            <textarea 
              className="comment-input" 
              placeholder="Share constructive observations or suggestions..." 
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
              <FiShield /> Submit Anonymously (Hides student identity)
            </label>

            <div>
              <button className="btn-cancel" onClick={() => setView('list')}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW SUBMISSION DETAIL MODAL */}
      {viewingFeedback && viewingFeedback.feedback && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setViewingFeedback(null)}
        >
          <div 
            style={{
              background: 'var(--fb-card-bg)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              border: '1px solid var(--fb-card-border)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Sora, sans-serif', fontSize: '1.25rem', color: 'var(--fb-text-primary)' }}>
                  {viewingFeedback.subject}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--fb-accent)', fontWeight: 600 }}>
                  {viewingFeedback.faculty}
                </div>
              </div>
              <button 
                onClick={() => setViewingFeedback(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fb-text-muted)', padding: 4 }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'var(--fb-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--fb-card-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--fb-text-muted)' }}>Teaching Quality</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fb-star-active)' }}>
                    ★ {viewingFeedback.feedback.teaching_quality} / 5
                  </div>
                </div>
                <div style={{ background: 'var(--fb-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--fb-card-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--fb-text-muted)' }}>Course Content</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fb-star-active)' }}>
                    ★ {viewingFeedback.feedback.course_content} / 5
                  </div>
                </div>
                <div style={{ background: 'var(--fb-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--fb-card-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--fb-text-muted)' }}>Communication</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fb-star-active)' }}>
                    ★ {viewingFeedback.feedback.communication} / 5
                  </div>
                </div>
                <div style={{ background: 'var(--fb-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--fb-card-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--fb-text-muted)' }}>Overall Rating</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fb-star-active)' }}>
                    ★ {viewingFeedback.feedback.overall_rating} / 5
                  </div>
                </div>
              </div>

              {viewingFeedback.feedback.comments && (
                <div style={{ background: 'var(--fb-bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--fb-card-border)', marginTop: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: 4, color: 'var(--fb-text-primary)' }}>Your Feedback Comments:</div>
                  <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--fb-text-secondary)', lineHeight: 1.5 }}>
                    {viewingFeedback.feedback.comments}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--fb-text-muted)', marginTop: 8 }}>
                <span>Submitted: {viewingFeedback.feedback.created_at ? formatDate(viewingFeedback.feedback.created_at) : 'Completed'}</span>
                <span>{viewingFeedback.feedback.is_anonymous ? 'Submitted Anonymously' : 'Identified Submission'}</span>
              </div>
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
            type="button"
            className={`star-btn ${star <= value ? 'active' : ''}`}
            onClick={() => onRate(id, star)}
          >
            <FiStar style={{ fill: star <= value ? 'currentColor' : 'none' }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Feedback;