// src/pages/student/Assignments.jsx
import React, { useState, useMemo } from 'react';
import './Assignments.css';
import { 
  FiBookOpen, FiCalendar, FiClock, FiUploadCloud, 
  FiCheckCircle, FiFileText, FiAlertCircle, FiX, FiExternalLink, FiAward
} from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { useMutation } from '../../hooks/useMutation';
import { useToast } from '../../context/ToastContext';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const Assignments = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const toast = useToast();

  // Fetch all assignments and student's submissions
  const { 
    data: assignmentsData, 
    loading: loadingAssignments, 
    error: errorAssignments, 
    refetch: refetchAssignments 
  } = useApi(endpoints.courses.assignments, { params: { page_size: 100 } });

  const { 
    data: submissionsData, 
    loading: loadingSubmissions, 
    error: errorSubmissions, 
    refetch: refetchSubmissions 
  } = useApi(endpoints.courses.submissionList, { params: { page_size: 100 } });

  const { mutate: submitAssignment } = useMutation(endpoints.courses.submissionList, {
    method: 'POST',
  });

  const rawAssignments = Array.isArray(assignmentsData) 
    ? assignmentsData 
    : (assignmentsData?.results || []);

  const rawSubmissions = Array.isArray(submissionsData) 
    ? submissionsData 
    : (submissionsData?.results || []);

  // Map submissions by assignment ID
  const submissionMap = useMemo(() => {
    const map = new Map();
    rawSubmissions.forEach(sub => {
      // sub.assignment may be an ID or object
      const assignId = typeof sub.assignment === 'object' ? sub.assignment?.id : sub.assignment;
      if (assignId) {
        map.set(assignId, sub);
      }
    });
    return map;
  }, [rawSubmissions]);

  // Combine assignments with submission info
  const combinedAssignments = useMemo(() => {
    return rawAssignments.map(assign => {
      const sub = submissionMap.get(assign.id);
      let status = 'pending';
      let marksDisplay = null;

      if (sub) {
        if (sub.status === 'graded' || sub.marks_obtained !== null && sub.marks_obtained !== undefined) {
          status = 'graded';
          marksDisplay = `${sub.marks_obtained ?? 0}/${assign.max_marks || 100}`;
        } else {
          status = 'submitted';
        }
      }

      let formattedDate = 'No deadline';
      let formattedTime = '';
      if (assign.due_date) {
        const d = new Date(assign.due_date);
        formattedDate = formatDate(assign.due_date);
        formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return {
        id: assign.id,
        title: assign.title,
        description: assign.description,
        subject: assign.course_code || (assign.course?.code ? `${assign.course.code} - ${assign.course.title || ''}` : 'Course Assignment'),
        deadline: formattedDate,
        time: formattedTime,
        status,
        marks: marksDisplay,
        rawMarks: sub?.marks_obtained,
        maxMarks: assign.max_marks || 100,
        submission: sub,
      };
    });
  }, [rawAssignments, submissionMap]);

  const counts = useMemo(() => ({
    pending: combinedAssignments.filter(a => a.status === 'pending').length,
    submitted: combinedAssignments.filter(a => a.status === 'submitted').length,
    graded: combinedAssignments.filter(a => a.status === 'graded').length,
  }), [combinedAssignments]);

  const filteredAssignments = useMemo(() => {
    return combinedAssignments.filter(a => a.status === activeTab);
  }, [combinedAssignments, activeTab]);

  const handleUpload = async (assignId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(assignId);
    const formData = new FormData();
    formData.append('assignment', assignId);
    formData.append('submission_file', file);
    formData.append('submission_text', `Submitted file: ${file.name}`);

    try {
      await submitAssignment(formData);
      toast.success(`File "${file.name}" uploaded successfully!`);
      await Promise.all([refetchAssignments(), refetchSubmissions()]);
    } catch (err) {
      toast.error(err.message || 'Failed to upload submission. Please try again.');
    } finally {
      setUploadingId(null);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const loading = loadingAssignments || loadingSubmissions;
  const error = errorAssignments || errorSubmissions;

  return (
    <div className="assignments-container">
      
      <div className="assignments-header">
        <h1><FiFileText style={{ color: 'var(--assign-accent)' }} /> Course Assignments</h1>
        <p>Manage your pending tasks and view graded submissions.</p>
      </div>

      <div className="assign-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending <span className="tab-badge">{counts.pending}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted <span className="tab-badge">{counts.submitted}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}
          onClick={() => setActiveTab('graded')}
        >
          Graded <span className="tab-badge">{counts.graded}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton height="110px" borderRadius="12px" />
          <Skeleton height="110px" borderRadius="12px" />
          <Skeleton height="110px" borderRadius="12px" />
        </div>
      ) : error ? (
        <ErrorState 
          message="Failed to load assignments. Please try again." 
          onRetry={() => { refetchAssignments(); refetchSubmissions(); }} 
        />
      ) : (
        <div className="assign-list">
          {filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <FiCheckCircle className="empty-icon" />
              <h3>No {activeTab} assignments</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filteredAssignments.map(assign => (
              <div key={assign.id} className={`assign-card ${assign.status}`}>
                
                <div className="assign-info">
                  <h3 className="assign-title">{assign.title}</h3>
                  <div className="assign-subject">
                    <FiBookOpen /> {assign.subject}
                  </div>
                  {assign.description && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--assign-text-muted)' }}>
                      {assign.description}
                    </p>
                  )}
                  <div className="assign-meta">
                    <div className="meta-item">
                      <FiCalendar /> Due: {assign.deadline}
                    </div>
                    {assign.time && (
                      <div className="meta-item">
                        <FiClock /> {assign.time}
                      </div>
                    )}
                  </div>
                </div>

                <div className="assign-actions">
                  <span className={`assign-status status-${assign.status}`}>
                    {assign.status === 'pending' && <><FiAlertCircle style={{ marginBottom: '-2px' }} /> Pending</>}
                    {assign.status === 'submitted' && <><FiCheckCircle style={{ marginBottom: '-2px' }} /> Under Review</>}
                    {assign.status === 'graded' && <><FiAward style={{ marginBottom: '-2px' }} /> Graded</>}
                  </span>

                  {assign.status === 'pending' && (
                    <div className="file-input-wrapper">
                      <button 
                        className="btn-action btn-primary"
                        disabled={uploadingId === assign.id}
                      >
                        <FiUploadCloud /> {uploadingId === assign.id ? 'Uploading...' : 'Upload Submission'}
                      </button>
                      <input 
                        type="file" 
                        onChange={(e) => handleUpload(assign.id, e)} 
                        disabled={uploadingId === assign.id}
                      />
                    </div>
                  )}

                  {assign.status === 'submitted' && (
                    <button 
                      className="btn-action"
                      onClick={() => setSelectedSubmission(assign)}
                    >
                      <FiFileText /> View Submission
                    </button>
                  )}

                  {assign.status === 'graded' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <div className="grade-score">{assign.marks}</div>
                      <button 
                        className="btn-action"
                        style={{ fontSize: '12px', padding: '4px 10px' }}
                        onClick={() => setSelectedSubmission(assign)}
                      >
                        <FiFileText /> View Feedback
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Submission / Feedback Modal */}
      {selectedSubmission && (
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
          onClick={() => setSelectedSubmission(null)}
        >
          <div 
            style={{
              background: 'var(--assign-card-bg)',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              border: '1px solid var(--assign-card-border)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Sora, sans-serif', fontSize: '1.25rem', color: 'var(--assign-text-primary)' }}>
                  {selectedSubmission.title}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--assign-accent)', fontWeight: 600 }}>
                  {selectedSubmission.subject}
                </div>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--assign-text-muted)', padding: 4 }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              {selectedSubmission.submission?.submitted_at && (
                <div style={{ fontSize: '13px', color: 'var(--assign-text-secondary)' }}>
                  <strong>Submitted At:</strong> {formatDate(selectedSubmission.submission.submitted_at)}
                </div>
              )}

              {selectedSubmission.marks && (
                <div style={{ 
                  background: 'rgba(5, 150, 105, 0.08)', 
                  border: '1px solid rgba(5, 150, 105, 0.2)', 
                  borderRadius: '10px', 
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--assign-success)' }}>Final Score:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--assign-success)', fontFamily: 'Sora, sans-serif' }}>
                    {selectedSubmission.marks}
                  </span>
                </div>
              )}

              {selectedSubmission.submission?.feedback && (
                <div style={{ background: 'var(--assign-bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--assign-card-border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: 4, color: 'var(--assign-text-primary)' }}>Instructor Feedback:</div>
                  <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--assign-text-secondary)', lineHeight: 1.5 }}>
                    {selectedSubmission.submission.feedback}
                  </p>
                </div>
              )}

              {selectedSubmission.submission?.submission_file && (
                <a 
                  href={selectedSubmission.submission.submission_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action btn-primary"
                  style={{ textDecoration: 'none', justifyContent: 'center', marginTop: 8 }}
                >
                  <FiExternalLink /> Download Submitted File
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Assignments;

