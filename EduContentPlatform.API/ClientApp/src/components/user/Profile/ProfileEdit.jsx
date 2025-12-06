import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/api/user';
import FormInput from '../../common/Forms/FormInput';
import FormSelect from '../../common/Forms/FormSelect';
import Button from '../../common/UI/Button/Button';
import AvatarUpload from './AvatarUpload';
import './profile.css';

const ProfileEdit = ({ onSave, onCancel }) => {
  const { user: currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    department: '',
    bio: '',
    website: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
    },
    notifications: {
      emailNotifications: true,
      courseUpdates: true,
      reviewRequests: true,
      announcements: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from API
      // const data = await userService.getProfile(currentUser.id);
      
      // Mock data for now
      const mockData = {
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || '',
        institution: currentUser?.institution || '',
        department: currentUser?.department || '',
        bio: currentUser?.bio || 'Passionate educator with 10+ years of experience...',
        website: currentUser?.website || '',
        socialLinks: {
          twitter: currentUser?.socialLinks?.twitter || '',
          linkedin: currentUser?.socialLinks?.linkedin || '',
          github: currentUser?.socialLinks?.github || '',
        },
      };

      setFormData(prev => ({
        ...prev,
        ...mockData,
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Website URL is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value,
        },
      }));
    } else if (name.startsWith('notifications.')) {
      const notificationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationField]: checked,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAvatarUpdate = (avatarUrl) => {
    // This would be handled by the AvatarUpload component
    console.log('Avatar updated:', avatarUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setSuccess('');
      
      // Prepare data for API
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        institution: formData.institution,
        department: formData.department,
        bio: formData.bio,
        website: formData.website,
        socialLinks: formData.socialLinks,
      };

      // In a real app, this would call the API
      // const data = await userService.updateProfile(profileData);
      
      // Mock success response
      const mockResponse = {
        success: true,
        data: {
          user: {
            ...currentUser,
            ...profileData,
          },
        },
      };

      // Update user in context and localStorage
      updateUser(mockResponse.data.user);

      setSuccess('Profile updated successfully!');
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(mockResponse.data.user);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (loading) {
    return (
      <div className="profile-edit-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="profile-edit">
      <form onSubmit={handleSubmit} className="edit-form">
        {/* Avatar Upload */}
        <div className="edit-section">
          <h3 className="section-title">Profile Picture</h3>
          <AvatarUpload
            currentAvatar={currentUser?.avatar}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>

        {/* Personal Information */}
        <div className="edit-section">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-row">
            <FormInput
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              error={errors.firstName}
              disabled={saving}
            />

            <FormInput
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
              error={errors.lastName}
              disabled={saving}
            />
          </div>

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={errors.email}
            disabled={saving}
            helperText="This email will be used for account notifications"
          />
        </div>

        {/* Professional Information */}
        <div className="edit-section">
          <h3 className="section-title">Professional Information</h3>
          
          <FormInput
            label="Institution/Organization"
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g., University of Education"
            disabled={saving}
          />

          <FormInput
            label="Department"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
            disabled={saving}
          />
        </div>

        {/* Bio */}
        <div className="edit-section">
          <h3 className="section-title">About Me</h3>
          
          <div className="form-group">
            <label className="form-label">
              Bio
              <span className="char-count">
                {formData.bio.length}/500 characters
              </span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself, your experience, and interests..."
              className="bio-textarea"
              rows={5}
              maxLength={500}
              disabled={saving}
            />
            <div className="form-helper">
              This will be displayed on your public profile
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="edit-section">
          <h3 className="section-title">Social Links</h3>
          
          <FormInput
            label="Website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            error={errors.website}
            disabled={saving}
            icon="🌐"
          />

          <FormInput
            label="Twitter"
            type="url"
            name="social.twitter"
            value={formData.socialLinks.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
            disabled={saving}
            icon="𝕏"
          />

          <FormInput
            label="LinkedIn"
            type="url"
            name="social.linkedin"
            value={formData.socialLinks.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            disabled={saving}
            icon="in"
          />

          <FormInput
            label="GitHub"
            type="url"
            name="social.github"
            value={formData.socialLinks.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
            disabled={saving}
            icon="⎋"
          />
        </div>

        {/* Notification Preferences */}
        <div className="edit-section">
          <h3 className="section-title">Notification Preferences</h3>
          
          <div className="notifications-grid">
            <label className="notification-option">
              <input
                type="checkbox"
                name="notifications.emailNotifications"
                checked={formData.notifications.emailNotifications}
                onChange={handleChange}
                disabled={saving}
              />
              <div className="notification-content">
                <div className="notification-title">Email Notifications</div>
                <div className="notification-description">
                  Receive important account notifications via email
                </div>
              </div>
            </label>

            <label className="notification-option">
              <input
                type="checkbox"
                name="notifications.courseUpdates"
                checked={formData.notifications.courseUpdates}
                onChange={handleChange}
                disabled={saving}
              />
              <div className="notification-content">
                <div className="notification-title">Course Updates</div>
                <div className="notification-description">
                  Get notified about updates to your enrolled courses
                </div>
              </div>
            </label>

            <label className="notification-option">
              <input
                type="checkbox"
                name="notifications.reviewRequests"
                checked={formData.notifications.reviewRequests}
                onChange={handleChange}
                disabled={saving}
              />
              <div className="notification-content">
                <div className="notification-title">Review Requests</div>
                <div className="notification-description">
                  Receive notifications for content review requests
                </div>
              </div>
            </label>

            <label className="notification-option">
              <input
                type="checkbox"
                name="notifications.announcements"
                checked={formData.notifications.announcements}
                onChange={handleChange}
                disabled={saving}
              />
              <div className="notification-content">
                <div className="notification-title">Announcements</div>
                <div className="notification-description">
                  Platform announcements and news updates
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <div className="success-text">{success}</div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{errors.submit}</div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;