// src/pages/auth/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiAlertTriangle,
  FiChevronRight,
  FiShield,
  FiBook,
  FiBarChart2,
  FiCalendar,
} from 'react-icons/fi';
import './Login.css';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECS = 30;

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type, message }
  const [fieldErrors, setFieldErrors] = useState({});

  // Security state
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const identifierRef = useRef(null);

  // Restore saved identifier
  useEffect(() => {
    const saved = localStorage.getItem('erp_remember_id');
    if (saved) {
      setIdentifier(saved);
      setRememberMe(true);
    }
    identifierRef.current?.focus();
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
        setAlert(null);
      } else {
        setCountdown(remaining);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) errs.identifier = 'Please enter your email, enrollment ID, or username.';
    if (!password) errs.password = 'Please enter your password.';
    else if (password.length < 4) errs.password = 'Password must be at least 4 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (lockedUntil && Date.now() < lockedUntil) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login(identifier.trim(), password, rememberMe);

      if (rememberMe) {
        localStorage.setItem('erp_remember_id', identifier.trim());
      } else {
        localStorage.removeItem('erp_remember_id');
      }

      setAlert({
        type: 'success',
        message: `Welcome back, ${result.user?.name || 'User'}! Redirecting…`,
      });
      setAttempts(0);

      // Determine redirect destination
      const params = new URLSearchParams(location.search);
      const nextParam = params.get('next');
      const role = result.role || result.user?.role;
      const targetDashboard = `/${role === 'admin' ? 'a' : role === 'faculty' ? 'f' : 's'}/dashboard`;
      const destination = nextParam && nextParam.startsWith('/') ? nextParam : targetDashboard;

      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 600);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      let msg = err.message || 'Invalid credentials or server error.';
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECS * 1000;
        setLockedUntil(until);
        setAlert({
          type: 'error',
          message: `Too many failed attempts. Account locked for ${LOCKOUT_SECS} seconds.`,
        });
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setAlert({
          type: 'error',
          message: `${msg} (${remaining} attempt${remaining !== 1 ? 's' : ''} remaining)`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setAlert({
      type: 'warning',
      message: 'Please contact the ERP System Administrator to reset your credentials.',
    });
  };

  const isLocked = Boolean(lockedUntil && Date.now() < lockedUntil);

  return (
    <div className="login-page">
      {/* LEFT BRAND PANEL */}
      <aside className="login-brand">
        <div className="brand-logo-row">
          <div className="brand-logo-icon">
            <FiBook size={24} />
          </div>
          <div className="brand-wordmark">
            <strong>UNIVERSITY ERP</strong>
            <span>Academic Portal</span>
          </div>
        </div>

        <div className="brand-hero">
          <div className="brand-tag">
            <div className="brand-tag-dot" />
            Active Session 2025–26
          </div>
          <div className="brand-divider" />
          <h1>
            Smart Academic<br />
            Management<br />
            <em>Simplified.</em>
          </h1>
          <p>
            Unified institutional platform for students, faculty, and administrators to manage academics, attendance, courses, grades, and finance.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon"><FiBook size={16} /></div>
              <span>Course & Curriculum Management</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><FiCalendar size={16} /></div>
              <span>Timetable & Attendance Tracking</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><FiBarChart2 size={16} /></div>
              <span>Real-Time Results & Analytics</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><FiShield size={16} /></div>
              <span>Secure Role-Based Access</span>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <p>© 2026 University ERP</p>
          <div className="brand-footer-dot" />
          <p>All rights reserved</p>
          <div className="brand-footer-dot" />
          <p>v2.0.0</p>
        </div>
      </aside>

      {/* RIGHT LOGIN PANEL */}
      <main className="login-right">
        <div className="login-card">
          <div className="mobile-brand-row">
            <div className="brand-logo-icon">
              <FiBook size={20} />
            </div>
            <strong>UNIVERSITY ERP</strong>
          </div>

          <div className="login-card__header">
            <h2>Sign In to Portal</h2>
            <p>Enter your institutional credentials to access your dashboard</p>
          </div>

          {alert && (
            <div className={`login-alert login-alert--${alert.type}`}>
              {alert.type === 'success' ? (
                <FiCheckCircle size={16} />
              ) : alert.type === 'warning' ? (
                <FiAlertTriangle size={16} />
              ) : (
                <FiAlertCircle size={16} />
              )}
              <span>{alert.message}</span>
            </div>
          )}

          {attempts > 0 && attempts < MAX_ATTEMPTS && !isLocked && (
            <div className="attempts-badge">
              <FiAlertTriangle size={13} />
              {MAX_ATTEMPTS - attempts} login attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining
            </div>
          )}

          {isLocked && (
            <div className="lockout-timer">
              🔒 Account temporarily locked. Try again in <strong>{countdown}s</strong>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Identifier Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">
                Email / Enrollment ID / Username
                <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <FiUser size={17} />
                </span>
                <input
                  ref={identifierRef}
                  id="identifier"
                  type="text"
                  className={`form-input${fieldErrors.identifier ? ' form-input--error' : ''}`}
                  placeholder="e.g. 21CS049 or user@university.edu"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setFieldErrors((p) => ({ ...p, identifier: '' }));
                  }}
                  disabled={loading || isLocked}
                  autoComplete="username"
                  spellCheck={false}
                />
              </div>
              {fieldErrors.identifier && (
                <span className="field-error">
                  <FiAlertCircle size={12} /> {fieldErrors.identifier}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <FiLock size={17} />
                </span>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({ ...p, password: '' }));
                  }}
                  disabled={loading || isLocked}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="field-error">
                  <FiAlertCircle size={12} /> {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row-meta">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading || isLocked}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-link"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-btn${loading ? ' login-btn--loading' : ''}`}
              disabled={loading || isLocked}
            >
              {loading ? (
                <>
                  <div className="btn-spinner" /> Authenticating…
                </>
              ) : isLocked ? (
                <>🔒 Locked ({countdown}s)</>
              ) : (
                <>
                  Sign In <FiChevronRight size={17} />
                </>
              )}
            </button>

            <div className="form-divider">
              <span>Role is verified automatically</span>
            </div>

            <div className="login-help">
              Having trouble accessing your account?{' '}
              <button type="button" onClick={handleForgotPassword}>
                Contact Support
              </button>
            </div>
          </form>

          <div className="login-card__footer">
            <p>© 2026 University ERP System</p>
            <div style={{ display: 'flex', gap: 14 }}>
              <button type="button" className="forgot-link" style={{ fontSize: '12px' }}>
                Privacy Policy
              </button>
              <button type="button" className="forgot-link" style={{ fontSize: '12px' }}>
                Help Desk
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
