import React, { useState, useEffect } from 'react';
import { useEditorial } from '../../../hooks/useEditorial';
import ContentQueue from './ContentQueue';
import AssignReviewers from './AssignReviewers';
import EditorialCalendar from './EditorialCalendar';
import ContentApproval from './ContentApproval';
import './editorDashboard.css';

const EditorialDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [stats, setStats] = useState({
    pending: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
    assigned: 0
  });
  
  const { getEditorialStats } = useEditorial();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getEditorialStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch editorial stats:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'queue':
        return <ContentQueue />;
      case 'assign':
        return <AssignReviewers />;
      case 'calendar':
        return <EditorialCalendar />;
      case 'approval':
        return <ContentApproval />;
      default:
        return <ContentQueue />;
    }
  };

  return (
    <div className="editorial-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Editorial Dashboard</h1>
        <div className="header-actions">
          <button className="btn btn-primary">New Assignment</button>
          <button className="btn btn-secondary">Generate Report</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Pending Review</h3>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-subtitle">Content awaiting review</div>
        </div>
        <div className="stat-card">
          <h3>In Review</h3>
          <div className="stat-number">{stats.inReview}</div>
          <div className="stat-subtitle">Currently being reviewed</div>
        </div>
        <div className="stat-card">
          <h3>Assigned</h3>
          <div className="stat-number">{stats.assigned}</div>
          <div className="stat-subtitle">To be assigned</div>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-subtitle">This month</div>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-subtitle">This month</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="editorial-tabs">
        <button 
          className={`tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          Content Queue
        </button>
        <button 
          className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
          onClick={() => setActiveTab('assign')}
        >
          Assign Reviewers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Editorial Calendar
        </button>
        <button 
          className={`tab-btn ${activeTab === 'approval' ? 'active' : ''}`}
          onClick={() => setActiveTab('approval')}
        >
          Content Approval
        </button>
      </div>

      {/* Main Content */}
      <div className="editorial-content">
        {renderTabContent()}
      </div>

      {/* Recent Activity Sidebar */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {/* Activity items will be populated here */}
        </div>
      </div>
    </div>
  );
};

export default EditorialDashboard;