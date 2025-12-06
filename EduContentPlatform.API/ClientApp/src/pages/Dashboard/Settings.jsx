import React, { useState } from 'react';
// DashboardLayout provided by router
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import './dashboard.css';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-container">
        <h2>Account Settings</h2>

        {saved && <div className="success-message">Settings saved successfully!</div>}

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Personal Information */}
          <section className="settings-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <FormInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <FormInput
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
            <div>
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about yourself"
                rows="4"
              />
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="settings-section">
            <h3>Notification Preferences</h3>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="email"
                  checked={formData.notifications.email}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Email Notifications</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="push"
                  checked={formData.notifications.push}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Push Notifications</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="marketing"
                  checked={formData.notifications.marketing}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Marketing Emails</span>
              </label>
            </div>
          </section>

          {/* Security */}
          <section className="settings-section">
            <h3>Security</h3>
            <Button variant="secondary" type="button">
              Change Password
            </Button>
            <Button variant="secondary" type="button" style={{ marginTop: '1rem' }}>
              Two-Factor Authentication
            </Button>
          </section>

          {/* Danger Zone */}
          <section className="settings-section danger-zone">
            <h3>Danger Zone</h3>
            <Button variant="danger" type="button">
              Delete Account
            </Button>
          </section>

          <div className="form-actions">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </div>
        </form>
      </div>
  );
};

export default Settings;
