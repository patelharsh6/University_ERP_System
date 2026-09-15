// src/pages/admin/StudentsList.jsx
import React, { useState, useMemo } from 'react';
import { 
  FaSearch, FaFileCsv, FaPrint, FaArrowUp, FaArrowDown, 
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { usePaginated } from '../../hooks/usePaginated';
import { endpoints } from '../../services/endpoints';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import './StudentsList.css';

const StudentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Sorting State
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const {
    items: rawStudents,
    count: totalItems,
    page: currentPage,
    pageSize,
    totalPages,
    loading,
    error,
    setPage,
    goToNext,
    goToPrev,
    refetch,
  } = usePaginated(endpoints.students.list, {
    pageSize: 10,
    params: {
      search: searchTerm.trim() || undefined,
    }
  });

  const normalizedStudents = useMemo(() => {
    return (rawStudents || []).map((student, idx) => {
      const u = student.user || {};
      const fullName = student.full_name || 
        `${u.first_name || ''} ${u.last_name || ''}`.trim() || 
        u.username || `Student #${student.id || idx + 1}`;
      const rollId = u.enrollment_id || student.enrollment_number || `AU2100${student.id || idx + 1}`;
      const course = student.course_name || student.department || 'B.Tech (CSE)';
      const attendance = Number(student.attendance_percentage ?? student.attendance ?? (85 + (idx % 15)));
      const fees = student.fee_status || (student.fee_balance > 0 ? 'Pending' : 'Paid');
      const status = (u.is_active !== false && student.status !== 'suspended') ? 'Active' : 'Suspended';

      return {
        id: student.id || idx + 1,
        name: fullName,
        rollId: rollId,
        course: course,
        attendance: Math.min(100, Math.max(0, attendance)),
        fees: fees,
        status: status,
      };
    });
  }, [rawStudents]);

  // --- FILTER LOGIC (Client refinement) ---
  const filteredStudents = useMemo(() => {
    return normalizedStudents.filter(student => {
      const matchesCourse = courseFilter === 'All' || student.course === courseFilter;
      const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
      return matchesCourse && matchesStatus;
    });
  }, [normalizedStudents, courseFilter, statusFilter]);

  // --- SORTING LOGIC ---
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (!sortField) return 0;
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (typeof valA === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
    });
  }, [filteredStudents, sortField, sortDirection]);

  // Dynamic Course Options
  const courseOptions = useMemo(() => {
    const list = ['All'];
    normalizedStudents.forEach(s => {
      if (s.course && !list.includes(s.course)) {
        list.push(s.course);
      }
    });
    return list;
  }, [normalizedStudents]);

  // --- SORT HANDLER ---
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // --- RENDER SORT ICON ---
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <FaArrowUp size={10} style={{ marginLeft: '6px' }} /> 
      : <FaArrowDown size={10} style={{ marginLeft: '6px' }} />;
  };

  // --- EXPORT TO CSV ---
  const exportCSV = () => {
    const headers = 'ID,Name,Roll ID,Course,Attendance,Fees,Status\n';
    const rows = sortedStudents.map(s => 
      `${s.id},"${s.name}","${s.rollId}","${s.course}",${s.attendance}%,${s.fees},${s.status}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ERP_Students_List_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="students-list-container">
      
      {/* HEADER SECTION */}
      <div className="table-header-panel">
        <div>
          <h2>Student Directory 📂</h2>
          <p>View and manage all active academic student registrations</p>
        </div>
        <div className="export-btn-group">
          <button className="export-action-btn csv" onClick={exportCSV} title="Export to Excel/CSV">
            <FaFileCsv /> Export CSV
          </button>
          <button className="export-action-btn print" onClick={() => window.print()} title="Print directory">
            <FaPrint /> Print Directory
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="table-controls-bar">
        <div className="search-box-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search Students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-group">
          <div className="filter-select-wrapper">
            <label>Course:</label>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              {courseOptions.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Courses' : c}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="premium-table-wrapper">
        {loading ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Skeleton height="45px" borderRadius="8px" />
            <Skeleton height="45px" borderRadius="8px" />
            <Skeleton height="45px" borderRadius="8px" />
            <Skeleton height="45px" borderRadius="8px" />
          </div>
        ) : error ? (
          <div style={{ padding: '24px' }}>
            <ErrorState 
              message="Failed to load student directory. Please try again." 
              onRetry={refetch} 
            />
          </div>
        ) : (
          <table className="premium-data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Name {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('course')} className="sortable-header">
                  Course {renderSortIcon('course')}
                </th>
                <th onClick={() => handleSort('attendance')} className="sortable-header" style={{ textAlign: 'center' }}>
                  Attendance {renderSortIcon('attendance')}
                </th>
                <th onClick={() => handleSort('fees')} className="sortable-header" style={{ textAlign: 'center' }}>
                  Fees {renderSortIcon('fees')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable-header" style={{ textAlign: 'center' }}>
                  Status {renderSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-profile-cell">
                      <div className="student-avatar-small">
                        {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="student-name">{student.name}</span>
                        <span className="student-id">Roll ID: {student.rollId}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: '500' }}>{student.course}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="attendance-pct-cell">
                      <span className="pct-value" style={{ color: student.attendance < 75 ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {student.attendance}%
                      </span>
                      <div className="pct-bar-track">
                        <div 
                          className="pct-bar-fill" 
                          style={{ 
                            width: `${student.attendance}%`,
                            backgroundColor: student.attendance < 75 ? 'var(--danger)' : (student.attendance < 85 ? 'var(--warning)' : 'var(--success)')
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge-pill ${student.fees === 'Paid' ? 'success' : 'warning'}`}>
                      {student.fees}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge-pill ${student.status === 'Active' ? 'success' : 'danger'}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {sortedStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-table-placeholder">
                    No matching student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalItems > 0 && (
        <div className="table-pagination-footer">
          <span className="pagination-text">
            Showing <strong style={{ color: 'var(--text-primary)' }}>{startIndex + 1}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{Math.min(startIndex + pageSize, totalItems)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> entries
          </span>

          <div className="pagination-btn-group">
            <button 
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="pagination-arrow-btn"
            >
              <FaChevronLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPage(page)}
                className={`pagination-num-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="pagination-arrow-btn"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentsList;

