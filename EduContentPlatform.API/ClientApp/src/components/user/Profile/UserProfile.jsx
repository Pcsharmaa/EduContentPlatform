import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/api/user';
import { ROLE_DISPLAY_NAMES } from '../../../constants/userRoles';
import { dateUtils } from '../../../services/utils/formatDate';
import Button from '../../common/UI/Button/Button';
import './profile.css';

const UserProfile = ({ userId, onEdit, showEditButton = true }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If no userId is provided, use current user
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        setError('User not found');
        return;
      }

      // In a real app, this would fetch from API
      // const data = await userService.getProfile(targetUserId);
      
      // Mock data for now
      const mockProfile = {
        id: targetUserId,
        firstName: currentUser?.firstName || 'John',
        lastName: currentUser?.lastName || 'Doe',
        email: currentUser?.email || 'john.doe@example.com',
        role: currentUser?.role || 'student',
        institution: currentUser?.institution || 'University of Education',
        department: currentUser?.department || 'Computer Science',
        bio: 'Passionate educator with 10+ years of experience in teaching computer science. Specialized in machine learning and data structures.',
        avatar: null,
        joinDate: '2023-01-15T10:30:00Z',
        lastActive: '2024-02-20T14:45:00Z',
        website: 'https://johndoe.com',
        socialLinks: {
          twitter: 'https://twitter.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
        },
      };

      const mockStats = {
        coursesCreated: 12,
        publications: 8,
        studentsTaught: 450,
        reviewsCompleted: 36,
        averageRating: 4.8,
        contentDownloads: 1200,
      };

      setProfile(mockProfile);
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <Button onClick={fetchProfile} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-not-found">
        <div className="not-found-icon">👤</div>
        <h3>Profile Not Found</h3>
        <p>The requested profile could not be found.</p>
      </div>
    );
  }

  const isOwnProfile = profile.id === currentUser?.id;

  return (
    <div className="user-profile">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={`${profile.firstName} ${profile.lastName}`}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </div>
            )}
          </div>
          
          {showEditButton && isOwnProfile && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="edit-avatar-button"
            >
              Change Photo
            </Button>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-name-role">
            <h1 className="profile-name">
              {profile.firstName} {profile.lastName}
            </h1>
            <div className="profile-role-badge">
              {ROLE_DISPLAY_NAMES[profile.role] || profile.role}
            </div>
          </div>
          
          <p className="profile-email">{profile.email}</p>
          
          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-label">Institution:</span>
              <span className="meta-value">{profile.institution}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Department:</span>
              <span className="meta-value">{profile.department}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Member since:</span>
              <span className="meta-value">
                {dateUtils.formatDate(profile.joinDate, 'MMM yyyy')}
              </span>
            </div>
          </div>

          {showEditButton && isOwnProfile && (
            <div className="profile-actions">
              <Button onClick={onEdit} variant="primary">
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="profile-section">
          <h3 className="section-title">About</h3>
          <p className="profile-bio">{profile.bio}</p>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="profile-section">
          <h3 className="section-title">Activity Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.coursesCreated}</div>
              <div className="stat-label">Courses Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.publications}</div>
              <div className="stat-label">Publications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.studentsTaught.toLocaleString()}</div>
              <div className="stat-label">Students Taught</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.reviewsCompleted}</div>
              <div className="stat-label">Reviews Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.averageRating}</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.contentDownloads.toLocaleString()}</div>
              <div className="stat-label">Content Downloads</div>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Social */}
      <div className="profile-section">
        <h3 className="section-title">Contact & Social</h3>
        
        <div className="contact-info">
          {profile.website && (
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <a 
                href={profile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                {profile.website.replace('https://', '')}
              </a>
            </div>
          )}
        </div>

        {profile.socialLinks && (
          <div className="social-links">
            {profile.socialLinks.twitter && (
              <a 
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link twitter"
              >
                <span className="social-icon">𝕏</span>
                <span className="social-label">Twitter</span>
              </a>
            )}
            
            {profile.socialLinks.linkedin && (
              <a 
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <span className="social-icon">in</span>
                <span className="social-label">LinkedIn</span>
              </a>
            )}
            
            {profile.socialLinks.github && (
              <a 
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link github"
              >
                <span className="social-icon">⎋</span>
                <span className="social-label">GitHub</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="profile-section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="recent-activity">
          <div className="activity-item">
            <div className="activity-icon">📚</div>
            <div className="activity-content">
              <div className="activity-text">Published new course: "Advanced Machine Learning"</div>
              <div className="activity-time">2 days ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">👥</div>
            <div className="activity-content">
              <div className="activity-text">Joined "Data Science Educators" community</div>
              <div className="activity-time">1 week ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">⭐</div>
            <div className="activity-content">
              <div className="activity-text">Received 5-star review for "Python Fundamentals"</div>
              <div className="activity-time">2 weeks ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;