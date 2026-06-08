// src/pages/student/Profile.jsx
import React, { useState } from 'react';
import './Profile.css';
import { FiEdit3, FiSave, FiUser, FiBookOpen, FiShield, FiFileText, FiDownload } from 'react-icons/fi';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // MOCK USER DATA (Aligned with requested structure)
  const [userData, setUserData] = useState({
    // Personal
    firstName: "Harsh",
    lastName: "Patel",
    enrollmentNo: "22CE001",
    dob: "2003-05-12",
    gender: "Male",
    email: "harsh.patel@university.edu",
    phone: "+91 98765 43210",
    address: "B-402, Titanium City Centre, Ahmedabad, Gujarat",
    // Academic
    course: "B.Tech Computer Engineering",
    department: "Computer Science",
    semester: "6",
    batch: "2022-2026",
    section: "A",
    // Guardian
    fatherName: "Rajesh Patel",
    motherName: "Smita Patel",
    emergencyContact: "+91 99887 77665",
  });

  const documents = [
    { id: 'doc1', name: 'Aadhar Card', type: 'PDF' },
    { id: 'doc2', name: '12th Marksheet', type: 'PDF' },
    { id: 'doc3', name: 'Bonafide Certificate', type: 'PDF' },
    { id: 'doc4', name: 'University ID Card', type: 'Image' },
  ];

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Helper Component for Fields
  const InfoField = ({ label, name, value, type = "text", fullWidth = false }) => (
    <div className="info-group" style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <span className="label">{label}</span>
      {isEditing ? (
        type === "textarea" ? (
          <textarea 
            name={name} 
            value={value} 
            onChange={handleChange} 
            className="form-input" 
            rows="2"
          />
        ) : (
          <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={handleChange} 
            className="form-input"
          />
        )
      ) : (
        <span className="value">{value}</span>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {userData.firstName[0]}{userData.lastName[0]}
        </div>
        <div className="header-info">
          <h2>{userData.firstName} {userData.lastName}</h2>
          <div className="id-text">Enrollment No. {userData.enrollmentNo}</div>
          <div className="status-badge">Active Student</div>
        </div>
        
        <button 
          className={`edit-toggle-btn ${isEditing ? 'active' : ''}`} 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <><FiSave /> Save Profile</> : <><FiEdit3 /> Edit Profile</>}
        </button>
      </div>

      <div className="profile-grid">
        
        {/* LEFT COLUMN */}
        <div className="left-column">
          
          {/* PERSONAL INFORMATION */}
          <div className="section-card">
            <h3 className="section-title"><FiUser /> Personal Information</h3>
            <div className="info-grid">
              <InfoField label="First Name" name="firstName" value={userData.firstName} />
              <InfoField label="Last Name" name="lastName" value={userData.lastName} />
              <InfoField label="Date of Birth" name="dob" value={userData.dob} type="date" />
              <InfoField label="Gender" name="gender" value={userData.gender} />
              <InfoField label="Email Address" name="email" value={userData.email} />
              <InfoField label="Phone Number" name="phone" value={userData.phone} />
              <InfoField label="Residential Address" name="address" value={userData.address} type="textarea" fullWidth={true} />
            </div>
          </div>

          {/* GUARDIAN DETAILS */}
          <div className="section-card">
            <h3 className="section-title"><FiShield /> Guardian Details</h3>
            <div className="info-grid">
              <InfoField label="Father's Name" name="fatherName" value={userData.fatherName} />
              <InfoField label="Mother's Name" name="motherName" value={userData.motherName} />
              <InfoField label="Emergency Contact" name="emergencyContact" value={userData.emergencyContact} />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          
          {/* ACADEMIC INFORMATION */}
          <div className="section-card">
            <h3 className="section-title"><FiBookOpen /> Academic Info</h3>
            <div className="info-group" style={{ marginBottom: '16px' }}>
              <span className="label">Course</span>
              <span className="value">{userData.course}</span>
            </div>
            <div className="info-group" style={{ marginBottom: '16px' }}>
              <span className="label">Department</span>
              <span className="value">{userData.department}</span>
            </div>
            <div className="info-group" style={{ marginBottom: '16px' }}>
              <span className="label">Batch</span>
              <span className="value">{userData.batch}</span>
            </div>
            <div className="info-grid" style={{ gap: '16px' }}>
              <div className="info-group">
                <span className="label">Semester</span>
                <span className="value" style={{ color: 'var(--prof-accent-teal)', fontSize: '1.2rem' }}>{userData.semester}</span>
              </div>
              <div className="info-group">
                <span className="label">Section</span>
                <span className="value">{userData.section}</span>
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="section-card">
            <h3 className="section-title"><FiFileText /> Documents</h3>
            <div className="documents-grid">
              {documents.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="doc-info">
                    <FiFileText className="doc-icon" />
                    <span>{doc.name}</span>
                  </div>
                  <button className="btn-download-doc" onClick={() => alert(`Downloading ${doc.name}...`)}>
                    <FiDownload /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;