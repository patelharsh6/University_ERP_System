// src/pages/student/Enrollment.jsx
import React, { useState, useMemo } from 'react';
import './Enrollment.css';
import { 
  FiUserCheck, FiBookOpen, FiAward, FiClock, 
  FiCheckCircle, FiAlertCircle, FiInbox 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const Enrollment = () => {
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'completed'
  const { user } = useAuth();

  const { 
    data: enrollmentsData, 
    loading: loadingEnrollments, 
    error: errorEnrollments, 
    refetch: refetchEnrollments 
  } = useApi(endpoints.courses.enrollments, { params: { page_size: 100 } });

  const { 
    data: transcriptData, 
    loading: loadingTranscript, 
    error: errorTranscript, 
    refetch: refetchTranscript 
  } = useApi(endpoints.results.transcript);

  const rawEnrollments = Array.isArray(enrollmentsData) 
    ? enrollmentsData 
    : (enrollmentsData?.results || []);

  const currentSubjects = useMemo(() => {
    return rawEnrollments.map(enr => {
      const course = enr.course || {};
      return {
        id: enr.id,
        code: course.code || enr.course_code || 'CRS',
        name: course.title || enr.course_title || 'Enrolled Course',
        credits: course.credits || 4,
        type: course.course_type || (enr.is_elective ? 'Elective' : 'Core'),
      };
    });
  }, [rawEnrollments]);

  const completedSubjects = useMemo(() => {
    const list = [];
    const semesters = transcriptData?.semesters || [];

    if (Array.isArray(semesters)) {
      semesters.forEach(sem => {
        const semName = sem.name || `Semester ${sem.semester || ''}`;
        const courses = sem.results || sem.courses || [];
        courses.forEach(c => {
          list.push({
            sem: semName,
            code: c.subject_code || c.course_code || c.code || 'SUB',
            name: c.subject_name || c.course_title || c.title || 'Course',
            grade: c.grade_letter || c.grade || 'A',
            credits: c.credits || 4,
            passed: c.is_passed !== false,
          });
        });
      });
    }

    return list;
  }, [transcriptData]);

  // Financial and academic credit tallies
  const currentEnrolledCredits = useMemo(() => {
    return currentSubjects.reduce((acc, sub) => acc + (Number(sub.credits) || 0), 0);
  }, [currentSubjects]);

  const earnedCredits = useMemo(() => {
    if (transcriptData?.total_credits_earned !== undefined) {
      return Number(transcriptData.total_credits_earned);
    }
    const sumFromCompleted = completedSubjects
      .filter(s => s.passed)
      .reduce((acc, sub) => acc + (Number(sub.credits) || 0), 0);
    return sumFromCompleted > 0 ? sumFromCompleted : 104; // Fallback to standard baseline if no past transcript
  }, [transcriptData, completedSubjects]);

  const totalRequiredCredits = 160;
  const progressPercentage = Math.min(100, Math.round((earnedCredits / totalRequiredCredits) * 100));

  const studentName = user 
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username 
    : 'Student';
  const enrollmentNo = user?.enrollment_id || user?.id || 'AU23BCE0001';
  const program = user?.department_name || user?.department || 'B.Tech - Computer Engineering';
  const currentSemester = user?.semester ? `Semester ${user.semester}` : 'Semester VI';
  const status = user?.is_active ? 'Active' : 'Inactive';

  const loading = loadingEnrollments || loadingTranscript;
  const error = errorEnrollments || errorTranscript;

  return (
    <div className="enrollment-page">
      {/* ── HEADER ── */}
      <div className="enrollment-header">
        <div className="enrollment-title-group">
          <div className="enrollment-icon"><FiUserCheck size={24} /></div>
          <div>
            <h1 className="enrollment-title">Course Enrollment</h1>
            <p className="enrollment-subtitle">Track your enrolled courses and degree progress</p>
          </div>
        </div>
        <div className="enrollment-status">
          Status: <span className="status-badge"><FiCheckCircle size={14} /> {status}</span>
        </div>
      </div>

      {/* ── PROFILE & PROGRESS STRIP ── */}
      <div className="enrollment-summary">
        <div className="summary-left">
          <h2>{studentName}</h2>
          <p>{enrollmentNo} • {program}</p>
          <div className="sem-tag">{currentSemester}</div>
        </div>
        <div className="summary-right">
          <div className="progress-label">
            <span>Degree Progress</span>
            <strong>{progressPercentage}%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="credit-stats">
            <div>
              <strong>{earnedCredits}</strong> Earned
            </div>
            <div>
              <strong>{currentEnrolledCredits}</strong> Enrolled
            </div>
            <div>
              <strong>{totalRequiredCredits}</strong> Required
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="enroll-tabs">
        <button 
          className={`enroll-tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Currently Enrolled ({currentSubjects.length})
        </button>
        <button 
          className={`enroll-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Courses ({completedSubjects.length})
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="enroll-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton height="80px" borderRadius="12px" />
            <Skeleton height="80px" borderRadius="12px" />
            <Skeleton height="80px" borderRadius="12px" />
          </div>
        ) : error ? (
          <ErrorState 
            message="Failed to load enrollment data. Please try again." 
            onRetry={() => { refetchEnrollments(); refetchTranscript(); }} 
          />
        ) : (
          <>
            {activeTab === 'current' && (
              <div className="subjects-grid">
                {currentSubjects.map((sub, i) => (
                  <div key={sub.id || i} className="subject-card">
                    <div className="sub-top">
                      <span className={`sub-type ${(sub.type || 'core').toLowerCase()}`}>{sub.type}</span>
                      <span className="sub-credits"><FiAward size={14} /> {sub.credits} Credits</span>
                    </div>
                    <h3 className="sub-code">{sub.code}</h3>
                    <p className="sub-name">{sub.name}</p>
                  </div>
                ))}
                {currentSubjects.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    <FiInbox style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '12px' }} />
                    <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)' }}>No active course enrollments</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>You are not registered in any courses for the current semester.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="completed-table-wrap">
                {completedSubjects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    <FiInbox style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '12px' }} />
                    <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)' }}>No completed courses found</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Previous semester grade transcripts will appear here once published.</p>
                  </div>
                ) : (
                  <>
                    <table className="completed-table">
                      <thead>
                        <tr>
                          <th>Semester</th>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedSubjects.map((sub, i) => (
                          <tr key={i}>
                            <td><span className="sem-badge">{sub.sem}</span></td>
                            <td><strong>{sub.code}</strong></td>
                            <td>{sub.name}</td>
                            <td><span className="grade-pill">{sub.grade}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="info-box">
                      <FiAlertCircle size={16} />
                      <p>For a full breakdown of your grades and SGPA/CGPA calculations, please visit the <strong>Results & Reports</strong> page.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default Enrollment;

