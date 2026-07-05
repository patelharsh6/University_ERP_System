// src/pages/student/StudentsList.jsx
import React, { useState } from 'react';
import { FaSearch, FaFileCsv, FaPrint, FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './StudentsList.css';

const initialStudents = [
  { id: 1, name: "Harsh Patel", course: "B.Tech (CSE)", attendance: 92, fees: "Paid", status: "Active" },
  { id: 2, name: "Aditya Sharma", course: "B.Tech (CSE)", attendance: 82, fees: "Paid", status: "Active" },
  { id: 3, name: "Pooja Mehta", course: "B.Tech (ECE)", attendance: 71, fees: "Pending", status: "Active" },
  { id: 4, name: "Rahul Verma", course: "B.Tech (Mech)", attendance: 58, fees: "Pending", status: "Suspended" },
  { id: 5, name: "Sneha Reddy", course: "B.Tech (CSE)", attendance: 96, fees: "Paid", status: "Active" },
  { id: 6, name: "Amit Gupta", course: "B.Tech (ECE)", attendance: 88, fees: "Paid", status: "Active" },
  { id: 7, name: "Vikram Rathore", course: "B.Tech (Mech)", attendance: 76, fees: "Paid", status: "Active" },
  { id: 8, name: "Neha Joshi", course: "B.Tech (CSE)", attendance: 91, fees: "Pending", status: "Active" },
  { id: 9, name: "Karan Johar", course: "B.Tech (Civil)", attendance: 45, fees: "Pending", status: "Suspended" },
  { id: 10, name: "Deepika Padukone", course: "B.Tech (ECE)", attendance: 94, fees: "Paid", status: "Active" },
  { id: 11, name: "Ranbir Kapoor", course: "B.Tech (Mech)", attendance: 80, fees: "Paid", status: "Active" },
  { id: 12, name: "Alia Bhatt", course: "B.Tech (CSE)", attendance: 89, fees: "Paid", status: "Active" },
  { id: 13, name: "Siddharth Malhotra", course: "B.Tech (Civil)", attendance: 73, fees: "Pending", status: "Active" },
  { id: 14, name: "Kiara Advani", course: "B.Tech (ECE)", attendance: 95, fees: "Paid", status: "Active" },
  { id: 15, name: "Varun Dhawan", course: "B.Tech (Mech)", attendance: 64, fees: "Pending", status: "Active" }
];

const StudentsList = () => {
  const [students] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Sorting State
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // --- SORT HANDLER ---
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset page to 1 on sort change
  };

  // --- RENDER SORT ICON ---
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <FaArrowUp size={10} style={{ marginLeft: '6px' }} /> : <FaArrowDown size={10} style={{ marginLeft: '6px' }} />;
  };

  // --- FILTER & SEARCH LOGIC ---
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCourse = courseFilter === "All" || student.course === courseFilter;
    const matchesStatus = statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // --- SORTING LOGIC ---
  const sortedStudents = [...filteredStudents].sort((a, b) => {
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

  // --- PAGINATION LOGIC ---
  const totalItems = sortedStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Guard current page range
  const activePage = Math.min(currentPage, totalPages);
  
  const startIndex = (activePage - 1) * pageSize;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + pageSize);

  // --- EXPORT TO CSV ---
  const exportCSV = () => {
    const headers = "ID,Name,Course,Attendance,Fees,Status\n";
    const rows = sortedStudents.map(s => `${s.id},"${s.name}","${s.course}",${s.attendance}%,${s.fees},${s.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ERP_Students_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
        </div>
        
        <div className="filters-group">
          <div className="filter-select-wrapper">
            <label>Course:</label>
            <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Courses</option>
              <option value="B.Tech (CSE)">B.Tech (CSE)</option>
              <option value="B.Tech (ECE)">B.Tech (ECE)</option>
              <option value="B.Tech (Mech)">B.Tech (Mech)</option>
              <option value="B.Tech (Civil)">B.Tech (Civil)</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="premium-table-wrapper">
        <table className="premium-data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} className="sortable-header">
                Name {renderSortIcon("name")}
              </th>
              <th onClick={() => handleSort("course")} className="sortable-header">
                Course {renderSortIcon("course")}
              </th>
              <th onClick={() => handleSort("attendance")} className="sortable-header" style={{ textAlign: 'center' }}>
                Attendance {renderSortIcon("attendance")}
              </th>
              <th onClick={() => handleSort("fees")} className="sortable-header" style={{ textAlign: 'center' }}>
                Fees {renderSortIcon("fees")}
              </th>
              <th onClick={() => handleSort("status")} className="sortable-header" style={{ textAlign: 'center' }}>
                Status {renderSortIcon("status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-profile-cell">
                    <div className="student-avatar-small">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="student-name">{student.name}</span>
                      <span className="student-id">Roll ID: AU2100{student.id}</span>
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
            
            {paginatedStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-table-placeholder">
                  No matching student records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalItems > 0 && (
        <div className="table-pagination-footer">
          <span className="pagination-text">
            Showing <strong style={{ color: 'var(--text-primary)' }}>{startIndex + 1}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{Math.min(startIndex + pageSize, totalItems)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> entries
          </span>

          <div className="pagination-btn-group">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="pagination-arrow-btn"
            >
              <FaChevronLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-num-btn ${activePage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={activePage === totalPages}
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
