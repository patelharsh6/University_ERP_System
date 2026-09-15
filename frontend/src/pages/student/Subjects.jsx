// src/pages/student/Subjects.jsx
import React, { useState, useEffect, useMemo } from 'react';
import './Subjects.css';
import { FiBookOpen, FiFileText, FiDownload, FiCheckCircle, FiClock, FiCircle, FiInfo } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const Subjects = () => {
  const { data: subjectsData, loading: loadingSubjects, error: subjectsError, refetch: refetchSubjects } = useApi(endpoints.courses.subjects, {
    params: { page_size: 100 }
  });

  const { data: materialsData, loading: loadingMaterials, error: materialsError, refetch: refetchMaterials } = useApi(endpoints.courses.materials, {
    params: { page_size: 100 }
  });

  const rawSubjects = useMemo(() => {
    return Array.isArray(subjectsData)
      ? subjectsData
      : (subjectsData?.results || []);
  }, [subjectsData]);

  const rawMaterials = useMemo(() => {
    return Array.isArray(materialsData)
      ? materialsData
      : (materialsData?.results || []);
  }, [materialsData]);

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [activeTab, setActiveTab] = useState('modules');

  useEffect(() => {
    if (rawSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(String(rawSubjects[0].id));
    }
  }, [rawSubjects, selectedSubjectId]);

  const currentSubject = useMemo(() => {
    return rawSubjects.find(s => String(s.id) === String(selectedSubjectId)) || rawSubjects[0];
  }, [rawSubjects, selectedSubjectId]);

  const currentMaterials = useMemo(() => {
    return rawMaterials.filter(m => String(m.subject) === String(selectedSubjectId) || String(m.subject_id) === String(selectedSubjectId));
  }, [rawMaterials, selectedSubjectId]);

  const sampleModules = currentSubject ? [
    { id: 1, title: `Unit 1: Foundations of ${currentSubject.name}`, progress: 100, status: 'done' },
    { id: 2, title: `Unit 2: Core Concepts & Methodologies`, progress: 80, status: 'progress' },
    { id: 3, title: `Unit 3: Applied Principles & Design`, progress: 40, status: 'progress' },
    { id: 4, title: `Unit 4: Advanced Systems & Architecture`, progress: 0, status: 'pending' },
    { id: 5, title: `Unit 5: Case Studies & Emerging Trends`, progress: 0, status: 'pending' },
  ] : [];

  const renderStatus = (status) => {
    switch(status) {
      case 'done': return <span className="module-status status-done"><FiCheckCircle/> Completed</span>;
      case 'progress': return <span className="module-status status-progress"><FiClock/> In Progress</span>;
      default: return <span className="module-status status-pending"><FiCircle/> Pending</span>;
    }
  };

  const loading = loadingSubjects || loadingMaterials;
  const error = subjectsError || materialsError;

  if (loading) {
    return (
      <div className="subjects-container" style={{ padding: '24px' }}>
        <Skeleton variant="card" height={60} style={{ marginBottom: '20px' }} />
        <Skeleton variant="card" height={40} style={{ marginBottom: '20px' }} />
        <Skeleton variant="card" height={240} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="subjects-container" style={{ padding: '24px' }}>
        <ErrorState error={error} onRetry={() => { refetchSubjects(); refetchMaterials(); }} />
      </div>
    );
  }

  if (rawSubjects.length === 0) {
    return (
      <div className="subjects-container" style={{ padding: '24px' }}>
        <EmptyState
          icon={FiBookOpen}
          title="No Subjects Enrolled"
          description="There are currently no subjects assigned or available for your semester."
        />
      </div>
    );
  }

  return (
    <div className="subjects-container">
      {/* HEADER & SELECT */}
      <div className="subjects-header">
        <h1>Course Subjects</h1>
        <select 
          className="subject-select"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
        >
          {rawSubjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
          ))}
        </select>
      </div>

      {/* TABS */}
      <div className="subjects-tabs">
        <button 
          className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          Modules
        </button>
        <button 
          className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Study Materials ({currentMaterials.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'syllabus' ? 'active' : ''}`}
          onClick={() => setActiveTab('syllabus')}
        >
          Syllabus & Info
        </button>
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        {activeTab === 'modules' && (
          <div className="modules-list">
            {sampleModules.map(mod => (
              <div key={mod.id} className="module-item">
                <div className="module-header">
                  <h3 className="module-title">{mod.title}</h3>
                  {renderStatus(mod.status)}
                </div>
                <div className="module-progress-bar">
                  <div className="progress-fill" style={{ width: `${mod.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="materials-grid">
            {currentMaterials.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: '#64748b' }}>
                <FiInfo size={24} style={{ marginBottom: '8px' }} />
                <p>No study materials uploaded for {currentSubject?.name || 'this subject'} yet.</p>
              </div>
            ) : (
              currentMaterials.map(mat => (
                <div key={mat.id} className="material-card">
                  <div className="material-icon pdf">
                    <FiFileText />
                  </div>
                  <div className="material-info">
                    <div className="material-name">{mat.title || mat.name}</div>
                    <div className="material-meta">{mat.created_at ? formatDate(mat.created_at) : 'Document'}</div>
                  </div>
                  {mat.file && (
                    <a href={mat.file} target="_blank" rel="noreferrer" className="btn-download" title="Download">
                      <FiDownload size={18} />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="syllabus-view" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            <h3 style={{ marginBottom: '12px' }}>{currentSubject?.code}: {currentSubject?.name}</h3>
            <p><strong>Credits:</strong> {currentSubject?.credits || 3}</p>
            <p><strong>Department:</strong> {currentSubject?.department || 'Computer Science & Engineering'}</p>
            <p><strong>Semester:</strong> {currentSubject?.semester || 'Semester VI'}</p>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
              <strong>Course Syllabus Breakdown:</strong>
              <p style={{ marginTop: '8px' }}>
                1. Fundamental Principles & Theoretical Architecture<br/>
                2. Design Patterns, Relational & Systematic Modeling<br/>
                3. Analytical Problem Solving & Query Execution<br/>
                4. Performance Optimizations, Scaling & Concurrency Control<br/>
                5. System Security, Fault Tolerance & Case Analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
