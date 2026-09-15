// src/pages/student/Profile.jsx
import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FiEdit3, FiSave, FiUser, FiBookOpen, FiShield, FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { useMutation } from '../../hooks/useMutation';
import { endpoints } from '../../services/endpoints';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const Profile = () => {
  const { data: userProfile, loading, error, refetch } = useApi(endpoints.auth.profile);
  const { mutate: updateProfile, submitting: isSaving } = useMutation(endpoints.auth.profile, { method: 'PATCH' });
  const { refreshUser } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    enrollmentNo: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    course: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    semester: '6',
    batch: '2022-2026',
    section: 'A',
    fatherName: 'Rajesh Patel',
    motherName: 'Smita Patel',
    emergencyContact: '+91 99887 77665',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        enrollmentNo: userProfile.enrollment_id || 'N/A',
        dob: userProfile.date_of_birth || '',
        gender: userProfile.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : 'Not specified',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      }));
    }
  }, [userProfile]);

  const documents = [
    { id: 'doc1', name: 'Aadhar Card / Identity Proof', type: 'PDF' },
    { id: 'doc2', name: '12th Grade Marksheet', type: 'PDF' },
    { id: 'doc3', name: 'Bonafide Certificate', type: 'PDF' },
    { id: 'doc4', name: 'University Student ID Card', type: 'Image' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isEditing) {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        date_of_birth: formData.dob || null,
        gender: formData.gender ? formData.gender.toLowerCase() : '',
      };
      const result = await updateProfile(payload);
      if (result) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        if (refreshUser) refreshUser();
        refetch();
      } else {
        toast.error('Failed to update profile. Please check the entered information.');
      }
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="profile-container" style={{ padding: '24px' }}>
        <Skeleton variant="card" height={160} style={{ marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <Skeleton variant="card" height={360} />
          <Skeleton variant="card" height={360} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" style={{ padding: '24px' }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const initials = `${formData.firstName?.[0] || 'U'}${formData.lastName?.[0] || ''}`;

  const InfoField = ({ label, name, value, type = 'text', fullWidth = false }) => (
    <div className="info-group" style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <span className="label">{label}</span>
      {isEditing ? (
        type === 'textarea' ? (
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
        <span className="value">{value || '—'}</span>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      {/* 1. PROFILE HEADER CARD */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {initials}
        </div>
        <div className="header-info">
          <h2>{formData.firstName} {formData.lastName}</h2>
          <div className="id-text">Enrollment No. {formData.enrollmentNo}</div>
          <div className="status-badge"><FiCheckCircle size={13} style={{ marginRight: '4px' }} /> Active Student</div>
        </div>

        <button
          className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            'Saving...'
          ) : isEditing ? (
            <><FiSave /> Save Profile</>
          ) : (
            <><FiEdit3 /> Edit Profile</>
          )}
        </button>
      </div>

      <div className="profile-grid">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* PERSONAL INFORMATION */}
          <div className="section-card">
            <h3 className="section-title"><FiUser /> Personal Information</h3>
            <div className="info-grid">
              <InfoField label="First Name" name="firstName" value={formData.firstName} />
              <InfoField label="Last Name" name="lastName" value={formData.lastName} />
              <InfoField label="Date of Birth" name="dob" value={formData.dob} type="date" />
              <InfoField label="Gender" name="gender" value={formData.gender} />
              <InfoField label="Email Address" name="email" value={formData.email} />
              <InfoField label="Phone Number" name="phone" value={formData.phone} />
              <InfoField label="Residential Address" name="address" value={formData.address} type="textarea" fullWidth={true} />
            </div>
          </div>

          {/* GUARDIAN DETAILS */}
          <div className="section-card">
            <h3 className="section-title"><FiShield /> Guardian Details</h3>
            <div className="info-grid">
              <InfoField label="Father's Name" name="fatherName" value={formData.fatherName} />
              <InfoField label="Mother's Name" name="motherName" value={formData.motherName} />
              <InfoField label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} />
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
              <span className="value">{formData.course}</span>
            </div>
            <div className="info-group" style={{ marginBottom: '16px' }}>
              <span className="label">Department</span>
              <span className="value">{formData.department}</span>
            </div>
            <div className="info-group" style={{ marginBottom: '16px' }}>
              <span className="label">Batch</span>
              <span className="value">{formData.batch}</span>
            </div>
            <div className="info-grid" style={{ gap: '16px' }}>
              <div className="info-group">
                <span className="label">Semester</span>
                <span className="value" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{formData.semester}</span>
              </div>
              <div className="info-group">
                <span className="label">Section</span>
                <span className="value">{formData.section}</span>
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
                  <button className="btn-download-doc" onClick={() => toast.info(`Downloading ${doc.name}...`)}>
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