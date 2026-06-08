// src/pages/student/Settings.jsx
import React, { useState } from 'react';
import './Settings.css';
import { FiSettings, FiUser, FiLock, FiBell, FiShield } from 'react-icons/fi';

const Settings = () => {
  const [activeMenu, setActiveMenu] = useState('account');

  return (
    <div className="settings-container">
      
      <div className="settings-header">
        <h1><FiSettings style={{ color: 'var(--set-accent)' }} /> Settings</h1>
        <p>Manage your account preferences and security.</p>
      </div>

      <div className="settings-grid">
        
        {/* SIDE MENU */}
        <div className="settings-menu">
          <button 
            className={`menu-item ${activeMenu === 'account' ? 'active' : ''}`}
            onClick={() => setActiveMenu('account')}
          >
            <FiUser /> Account Profile
          </button>
          <button 
            className={`menu-item ${activeMenu === 'security' ? 'active' : ''}`}
            onClick={() => setActiveMenu('security')}
          >
            <FiLock /> Security & Password
          </button>
          <button 
            className={`menu-item ${activeMenu === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveMenu('notifications')}
          >
            <FiBell /> Notification Preferences
          </button>
          <button 
            className={`menu-item ${activeMenu === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveMenu('privacy')}
          >
            <FiShield /> Privacy
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="settings-content">
          
          {activeMenu === 'account' && (
            <div className="animate-fade">
              <h2>Account Profile</h2>
              <div className="form-group">
                <label>Recovery Email</label>
                <input type="email" className="form-input" defaultValue="harsh.patel@personal.com" />
              </div>
              <div className="form-group">
                <label>Phone Number (OTP Verification)</label>
                <input type="tel" className="form-input" defaultValue="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label>Language Preference</label>
                <select className="form-input">
                  <option>English (UK)</option>
                  <option>English (US)</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-save">Save Changes</button>
              </div>
            </div>
          )}

          {activeMenu === 'security' && (
            <div className="animate-fade">
              <h2>Security & Password</h2>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-input" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-input" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Confirm new password" />
              </div>
              <div className="form-actions">
                <button className="btn-save">Update Password</button>
              </div>
            </div>
          )}

          {activeMenu === 'notifications' && (
            <div className="animate-fade">
              <h2>Notification Preferences</h2>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p>Receive academic alerts via email</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>SMS Alerts</h4>
                  <p>Get important updates via SMS</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Push Notifications</h4>
                  <p>Enable in-browser push notifications</p>
                </div>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} />
              </div>

              <div className="form-actions">
                <button className="btn-save">Save Preferences</button>
              </div>
            </div>
          )}

          {activeMenu === 'privacy' && (
            <div className="animate-fade">
              <h2>Privacy Settings</h2>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Profile Visibility</h4>
                  <p>Allow other students to see your basic profile</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Share Academic Data</h4>
                  <p>Allow university placement cell to view your grades</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </div>

              <div className="form-actions">
                <button className="btn-save">Save Settings</button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
