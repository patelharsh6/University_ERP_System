// src/pages/admin/RegistrationForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaGraduationCap, FaFileAlt, FaClipboardCheck, 
  FaArrowLeft, FaArrowRight, FaCheckCircle, FaTrashAlt, FaUpload 
} from 'react-icons/fa';
import { request } from '../../services/api';
import { endpoints } from '../../services/endpoints';
import { useToast } from '../../context/ToastContext';
import './RegistrationForm.css';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  course: 'B.Tech (CSE)',
  admissionYear: '2026',
  previousQualification: '',
  semester: '1st',
  photoName: '',
  idProofName: '',
  declaration: false,
};

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = localStorage.getItem('registration-draft');
      return savedDraft ? JSON.parse(savedDraft) : initialFormState;
    } catch {
      return initialFormState;
    }
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enrolledStudentInfo, setEnrolledStudentInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  // --- AUTO-SAVE DRAFT TO LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem('registration-draft', JSON.stringify(formData));
    } catch {
      // Ignore localStorage exceptions
    }
  }, [formData]);

  // --- HANDLE INPUT CHANGE ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // --- FILE UPLOAD HANDLER ---
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file.name
      }));
      if (errors[fieldName]) {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  // --- VALIDATION RULES ---
  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }
    
    if (currentStep === 2) {
      if (!formData.previousQualification.trim()) newErrors.previousQualification = 'Academic history is required';
    }

    if (currentStep === 3) {
      if (!formData.photoName) newErrors.photoName = 'Profile photo is required';
      if (!formData.idProofName) newErrors.idProofName = 'Identity proof copy is required';
    }

    if (currentStep === 4) {
      if (!formData.declaration) newErrors.declaration = 'You must accept the declaration terms to submit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- NAVIGATION ---
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // --- CLEAR DRAFT ---
  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear this draft form? All changes will be lost.')) {
      localStorage.removeItem('registration-draft');
      setFormData(initialFormState);
      setStep(1);
      setErrors({});
      toast.info('Draft cleared.');
    }
  };

  // --- SUBMIT REGISTRATION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    const generatedUsername = (formData.firstName.toLowerCase().replace(/[^a-z0-9]/g, '') + 
      formData.lastName.toLowerCase().replace(/[^a-z0-9]/g, '') + 
      Math.floor(100 + Math.random() * 900)).slice(0, 30);
    const defaultPassword = 'StudentPass@2026';
    const enrollmentId = `AU26B${Math.floor(1000 + Math.random() * 9000)}`;

    const userPayload = {
      username: generatedUsername,
      email: formData.email,
      password: defaultPassword,
      password_confirm: defaultPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: 'student',
      phone: formData.phone,
      enrollment_id: enrollmentId,
      date_of_birth: formData.dob || undefined,
      gender: formData.gender.toLowerCase() || 'other',
    };

    try {
      const createdUser = await request(endpoints.auth.register, {
        method: 'POST',
        body: userPayload,
      });

      // Also create student profile
      try {
        await request(endpoints.students.list, {
          method: 'POST',
          body: {
            user: createdUser?.id,
            admission_year: parseInt(formData.admissionYear, 10) || 2026,
            semester: parseInt(formData.semester, 10) || 1,
            department: formData.course,
            course_name: formData.course,
          }
        });
      } catch {
        // Profile may auto-create via signals
      }

      setEnrolledStudentInfo({
        name: `${formData.firstName} ${formData.lastName}`,
        enrollmentId: enrollmentId,
        username: generatedUsername,
        course: formData.course,
      });

      toast.success('Student Enrolled Successfully!');
      setShowSuccessModal(true);
      localStorage.removeItem('registration-draft');
      setFormData(initialFormState);
      setStep(1);
    } catch (err) {
      toast.error(err.message || 'Enrollment registration failed. Please check form inputs.');
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      
      {/* HEADER WITH TRASH ACTION */}
      <div className="registration-header-bar">
        <div>
          <h2>Student Enrollment 📝</h2>
          <p>Complete the admissions profile wizard to register a new student</p>
        </div>
        <button className="clear-draft-btn" onClick={handleClearDraft} title="Reset enrollment form">
          <FaTrashAlt /> Clear Draft
        </button>
      </div>

      {/* PROGRESS INDICATOR */}
      <div className="progress-wizard-track">
        {[
          { label: 'Personal Details', icon: <FaUser /> },
          { label: 'Academic Info', icon: <FaGraduationCap /> },
          { label: 'Documents', icon: <FaFileAlt /> },
          { label: 'Review & Submit', icon: <FaClipboardCheck /> }
        ].map((item, idx) => {
          const stepNum = idx + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;
          return (
            <div key={idx} className={`wizard-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="node-badge-circle">
                {isCompleted ? <FaCheckCircle style={{ color: 'var(--success)', fontSize: '1.2rem' }} /> : item.icon}
              </div>
              <span className="node-label-text">{item.label}</span>
              {idx < 3 && <div className="node-connector-line" />}
            </div>
          );
        })}
      </div>

      {/* FORM WIZARD CARD */}
      <div className="form-wizard-card">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="form-step-content animate-fade">
              <h3>Personal Details</h3>
              <p className="step-subtitle">Provide basic biometric information about the candidate</p>
              
              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label>First Name <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'error-input' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-input-group">
                  <label>Last Name <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'error-input' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>

                <div className="form-input-group">
                  <label>Email Address <span className="req">*</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@edu.in"
                    className={errors.email ? 'error-input' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-input-group">
                  <label>Phone Number <span className="req">*</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className={errors.phone ? 'error-input' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-input-group">
                  <label>Date of Birth <span className="req">*</span></label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={errors.dob ? 'error-input' : ''}
                  />
                  {errors.dob && <span className="error-message">{errors.dob}</span>}
                </div>

                <div className="form-input-group">
                  <label>Gender <span className="req">*</span></label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleInputChange}
                    className={errors.gender ? 'error-input' : ''}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <div className="form-step-content animate-fade">
              <h3>Academic Registration Details</h3>
              <p className="step-subtitle">Configure courses and admission parameters for this profile</p>
              
              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label>Target Course / Branch</label>
                  <select name="course" value={formData.course} onChange={handleInputChange}>
                    <option value="B.Tech (CSE)">B.Tech (CSE)</option>
                    <option value="B.Tech (ECE)">B.Tech (ECE)</option>
                    <option value="B.Tech (Mech)">B.Tech (Mech)</option>
                    <option value="B.Tech (Civil)">B.Tech (Civil)</option>
                  </select>
                </div>

                <div className="form-input-group">
                  <label>Admission Year</label>
                  <select name="admissionYear" value={formData.admissionYear} onChange={handleInputChange}>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div className="form-input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Previous Qualification details <span className="req">*</span></label>
                  <textarea 
                    name="previousQualification" 
                    value={formData.previousQualification}
                    onChange={handleInputChange}
                    placeholder="E.g., High School CBSE 12th Board - 92.4% marks aggregate"
                    rows={3}
                    className={errors.previousQualification ? 'error-input' : ''}
                  />
                  {errors.previousQualification && <span className="error-message">{errors.previousQualification}</span>}
                </div>

                <div className="form-input-group">
                  <label>Current Target Semester</label>
                  <select name="semester" value={formData.semester} onChange={handleInputChange}>
                    <option value="1st">1st Semester</option>
                    <option value="3rd">3rd Semester (Lateral Entry)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Documents Upload */}
          {step === 3 && (
            <div className="form-step-content animate-fade">
              <h3>Document Attachments</h3>
              <p className="step-subtitle">Attach scanned PDF/Image records of necessary credentials</p>
              
              <div className="form-grid-layout">
                <div className="form-input-group file-uploader-box">
                  <label>Profile Picture Photograph <span className="req">*</span></label>
                  <div className={`upload-dropzone ${errors.photoName ? 'error' : ''}`}>
                    <FaUpload className="upload-icon" />
                    <span>{formData.photoName || 'Click to upload candidate photograph'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'photoName')}
                    />
                  </div>
                  {errors.photoName && <span className="error-message">{errors.photoName}</span>}
                </div>

                <div className="form-input-group file-uploader-box">
                  <label>Aadhar Card / Identity Proof <span className="req">*</span></label>
                  <div className={`upload-dropzone ${errors.idProofName ? 'error' : ''}`}>
                    <FaUpload className="upload-icon" />
                    <span>{formData.idProofName || 'Upload scanned Aadhaar / Identity proof PDF'}</span>
                    <input 
                      type="file" 
                      accept=".pdf,image/*" 
                      onChange={(e) => handleFileUpload(e, 'idProofName')}
                    />
                  </div>
                  {errors.idProofName && <span className="error-message">{errors.idProofName}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Submit */}
          {step === 4 && (
            <div className="form-step-content animate-fade">
              <h3>Review Admission Profile</h3>
              <p className="step-subtitle">Ensure all records are accurate before final submission</p>
              
              <div className="review-details-summary">
                <div className="review-section">
                  <h4>Personal Details</h4>
                  <div className="review-item-row"><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div className="review-item-row"><strong>Email / Phone:</strong> {formData.email} / {formData.phone}</div>
                  <div className="review-item-row"><strong>Gender / DOB:</strong> {formData.gender} / {formData.dob}</div>
                </div>

                <div className="review-section">
                  <h4>Academic Setup</h4>
                  <div className="review-item-row"><strong>Selected Course:</strong> {formData.course} ({formData.semester} Sem)</div>
                  <div className="review-item-row"><strong>Prev. Qualification:</strong> {formData.previousQualification}</div>
                  <div className="review-item-row"><strong>Admission Year:</strong> {formData.admissionYear}</div>
                </div>

                <div className="review-section">
                  <h4>Attached Records</h4>
                  <div className="review-item-row"><strong>Photo:</strong> {formData.photoName || 'Missing'}</div>
                  <div className="review-item-row"><strong>ID Proof:</strong> {formData.idProofName || 'Missing'}</div>
                </div>
              </div>

              <div className="declaration-row" style={{ marginTop: '20px' }}>
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-label" style={{ color: 'var(--text-primary)' }}>
                    I declare that all entries provided are true to the best of my academic knowledge.
                  </span>
                </label>
                {errors.declaration && <p className="error-message" style={{ marginTop: '6px' }}>{errors.declaration}</p>}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS FOOTER */}
          <div className="form-wizard-footer">
            {step > 1 ? (
              <button type="button" className="wizard-nav-btn back" onClick={handleBack}>
                <FaArrowLeft /> Previous Step
              </button>
            ) : <div />}

            {step < 4 ? (
              <button type="button" className="wizard-nav-btn next" onClick={handleNext}>
                Next Step <FaArrowRight />
              </button>
            ) : (
              <button type="submit" className="wizard-nav-btn submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Admissions...' : 'Enroll Student ✓'}
              </button>
            )}
          </div>

        </form>
      </div>

      {/* SUCCESS CONFIRMATION DIALOG */}
      {showSuccessModal && enrolledStudentInfo && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal-card animate-zoom" onClick={e => e.stopPropagation()}>
            <FaCheckCircle className="success-modal-icon" />
            <h3>Student Enrolled Successfully!</h3>
            <p>The enrollment application has been recorded in the central academic ERP database.</p>
            <div style={{ background: 'var(--main-bg, #f8fafc)', padding: '16px', borderRadius: '8px', margin: '16px 0', textAlign: 'left', fontSize: '13px' }}>
              <div><strong>Name:</strong> {enrolledStudentInfo.name}</div>
              <div><strong>Enrollment ID:</strong> {enrolledStudentInfo.enrollmentId}</div>
              <div><strong>Generated Username:</strong> {enrolledStudentInfo.username}</div>
              <div><strong>Course:</strong> {enrolledStudentInfo.course}</div>
            </div>
            <button className="success-modal-close" onClick={() => setShowSuccessModal(false)}>
              Okay, Go Back
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegistrationForm;

