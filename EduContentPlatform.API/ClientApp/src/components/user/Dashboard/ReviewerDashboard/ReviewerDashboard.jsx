import React, { useState, useEffect } from 'react';
import { useReview } from '../../../hooks/useReview';
import ReviewQueue from './ReviewQueue';
import ReviewForm from './ReviewForm';
import ReviewHistory from './ReviewHistory';
import FeedbackManager from './FeedbackManager';
import './reviewerDashboard.css';

const ReviewerDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { getReviewerStats } = useReview();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getReviewerStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch reviewer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'queue':
        return <ReviewQueue />;
      case 'review':
        return <ReviewForm />;
      case 'history':
        return <ReviewHistory />;
      case 'feedback':
        return <FeedbackManager />;
      default:
        return <ReviewQueue />;
    }
  };

  if (loading) {
    return (
      <div className="reviewer-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviewer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="reviewer-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Reviewer Dashboard</h1>
          <p className="header-subtitle">Manage your review assignments and feedback</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <i className="icon-bell"></i> Notifications ({stats.pending})
          </button>
          <button className="btn btn-outline">
            <i className="icon-settings"></i> Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="reviewer-stats-overview">
        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="icon-clock"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon in-progress">
            <i className="icon-edit"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="icon-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon overdue">
            <i className="icon-alert"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon rating">
            <i className="icon-star"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.rating.toFixed(1)}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => setActiveTab('review')}>
            <i className="icon-add"></i>
            <span>Start New Review</span>
          </button>
          <button className="action-btn">
            <i className="icon-calendar"></i>
            <span>View Schedule</span>
          </button>
          <button className="action-btn">
            <i className="icon-download"></i>
            <span>Export Reviews</span>
          </button>
          <button className="action-btn">
            <i className="icon-help"></i>
            <span>Review Guidelines</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="reviewer-tabs">
        <button 
          className={`tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          <i className="icon-list"></i>
          Review Queue
          {stats.pending > 0 && (
            <span className="badge">{stats.pending}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          <i className="icon-edit"></i>
          Review Form
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="icon-history"></i>
          Review History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <i className="icon-message"></i>
          Feedback Manager
        </button>
      </div>

      {/* Main Content Area */}
      <div className="reviewer-main-content">
        {renderTabContent()}
      </div>

      {/* Right Sidebar - Upcoming Deadlines */}
      <div className="reviewer-sidebar">
        <div className="sidebar-section">
          <h3><i className="icon-calendar"></i> Upcoming Deadlines</h3>
          <div className="deadline-list">
            {/* Deadline items will be populated */}
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3><i className="icon-trending-up"></i> Performance Summary</h3>
          <div className="performance-summary">
            {/* Performance metrics */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;