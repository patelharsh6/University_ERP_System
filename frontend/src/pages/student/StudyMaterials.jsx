// src/pages/student/StudyMaterials.jsx
import React, { useState, useMemo } from 'react';
import './StudyMaterials.css';
import { 
  FiBookOpen, FiDownload, FiEye, FiSearch, FiFileText, 
  FiVideo, FiArchive, FiFile, FiExternalLink, FiInbox 
} from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const StudyMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  const { 
    data: materialsData, 
    loading: loadingMaterials, 
    error: errorMaterials, 
    refetch: refetchMaterials 
  } = useApi(endpoints.courses.materials, { params: { page_size: 100 } });

  const { 
    data: subjectsData, 
    loading: loadingSubjects 
  } = useApi(endpoints.courses.subjects, { params: { page_size: 100 } });

  const rawMaterials = Array.isArray(materialsData) 
    ? materialsData 
    : (materialsData?.results || []);

  const rawSubjects = Array.isArray(subjectsData) 
    ? subjectsData 
    : (subjectsData?.results || []);

  const subjectOptions = useMemo(() => {
    const list = ['All Subjects'];
    rawSubjects.forEach(s => {
      const label = s.code ? `${s.code} - ${s.name}` : s.name;
      if (label && !list.includes(label)) {
        list.push(label);
      }
    });
    // Also include subjects present in materials if not already in list
    rawMaterials.forEach(m => {
      const label = m.course_code || (m.course?.code ? `${m.course.code} - ${m.course.title || ''}` : null);
      if (label && !list.includes(label)) {
        list.push(label);
      }
    });
    return list;
  }, [rawSubjects, rawMaterials]);

  const normalizedMaterials = useMemo(() => {
    return rawMaterials.map(mat => {
      let matType = (mat.material_type || 'pdf').toLowerCase();
      if (mat.file) {
        const ext = mat.file.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) matType = 'pdf';
        else if (['ppt', 'pptx'].includes(ext)) matType = 'ppt';
        else if (['doc', 'docx', 'txt'].includes(ext)) matType = 'doc';
        else if (['zip', 'rar', 'tar', 'gz'].includes(ext)) matType = 'zip';
        else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) matType = 'video';
      }

      const subjectLabel = mat.course_code || 
        (mat.course?.code ? `${mat.course.code} - ${mat.course.title || ''}` : 'General Material');

      return {
        id: mat.id,
        title: mat.title,
        description: mat.description,
        subject: subjectLabel,
        type: matType,
        date: mat.uploaded_at ? formatDate(mat.uploaded_at) : 'Recent',
        url: mat.file || mat.link || '#',
        isLink: Boolean(mat.link && !mat.file),
      };
    });
  }, [rawMaterials]);

  const getIconForType = (type) => {
    switch (type) {
      case 'pdf': return <FiFileText />;
      case 'ppt':
      case 'slides': return <FiVideo />;
      case 'doc': return <FiFile />;
      case 'zip': return <FiArchive />;
      case 'video': return <FiVideo />;
      case 'link': return <FiExternalLink />;
      default: return <FiFileText />;
    }
  };

  const filteredMaterials = useMemo(() => {
    return normalizedMaterials.filter(mat => {
      const matchesSubject = selectedSubject === 'All Subjects' || mat.subject.includes(selectedSubject) || selectedSubject.includes(mat.subject);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        mat.title.toLowerCase().includes(query) || 
        mat.subject.toLowerCase().includes(query) ||
        (mat.description && mat.description.toLowerCase().includes(query));
      return matchesSubject && matchesSearch;
    });
  }, [normalizedMaterials, selectedSubject, searchQuery]);

  const loading = loadingMaterials || loadingSubjects;

  return (
    <div className="materials-container">
      
      <div className="materials-header">
        <h1><FiBookOpen style={{ color: 'var(--mat-accent)' }} /> Study Materials</h1>
        
        <div className="materials-filters">
          <input 
            type="text" 
            className="mat-search" 
            placeholder="Search materials..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="mat-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjectOptions.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="materials-grid">
          <Skeleton height="110px" borderRadius="12px" />
          <Skeleton height="110px" borderRadius="12px" />
          <Skeleton height="110px" borderRadius="12px" />
          <Skeleton height="110px" borderRadius="12px" />
        </div>
      ) : errorMaterials ? (
        <ErrorState 
          message="Failed to load study materials. Please try again." 
          onRetry={refetchMaterials} 
        />
      ) : (
        <div className="materials-grid">
          {filteredMaterials.map(mat => (
            <div key={mat.id} className="mat-card">
              
              <div className={`mat-icon-wrapper ${mat.type}`}>
                {getIconForType(mat.type)}
              </div>

              <div className="mat-info">
                <h3 className="mat-title">{mat.title}</h3>
                <div className="mat-subject">{mat.subject}</div>
                {mat.description && (
                  <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: 'var(--mat-text-muted)', lineHeight: 1.4 }}>
                    {mat.description}
                  </p>
                )}
                <div className="mat-meta">
                  <span>{mat.date}</span>
                  <span>•</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{mat.type}</span>
                </div>
              </div>

              <div className="mat-actions">
                {mat.url && mat.url !== '#' && (
                  <>
                    <a 
                      href={mat.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-icon" 
                      title="View / Open"
                    >
                      <FiEye />
                    </a>
                    <a 
                      href={mat.url} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-icon" 
                      title="Download"
                    >
                      <FiDownload />
                    </a>
                  </>
                )}
              </div>

            </div>
          ))}
          
          {filteredMaterials.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--mat-text-muted)' }}>
              <FiInbox style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 6px 0', color: 'var(--mat-text-primary)' }}>No study materials found</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search query or subject filter.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default StudyMaterials;

