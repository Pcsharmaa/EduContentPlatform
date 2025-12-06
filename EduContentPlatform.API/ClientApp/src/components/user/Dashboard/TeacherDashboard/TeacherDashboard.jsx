import React, { useState, useEffect } from 'react';
import ContentManager from './ContentManager';
import Analytics from './Analytics';
import { useContent } from '../../../../hooks/useContent';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  FileText, Users, Eye, Download, Star, 
  TrendingUp, MessageSquare, Award, Calendar,
  BarChart3, BookOpen, Clock, DollarSign
} from 'lucide-react';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { userContent, loading, fetchTeacherDashboard } = useContent();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchTeacherDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadDashboardData();
  }, [fetchTeacherDashboard]);

  const teacherStats = [
    { 
      icon: <FileText size={24} />, 
      label: 'Total Content', 
      value: dashboardData?.totalContent || 0, 
      change: '+5 this month',
      color: 'blue',
      trend: 'up'
    },
    { 
      icon: <Users size={24} />, 
      label: 'Active Students', 
      value: dashboardData?.activeStudents || 0, 
      change: '+12 new',
      color: 'green',
      trend: 'up'
    },
    { 
      icon: <Eye size={24} />, 
      label: 'Total Views', 
      value: formatNumber(dashboardData?.totalViews || 0), 
      change: '+200 today',
      color: 'purple',
      trend: 'up'
    },
    { 
      icon: <Download size={24} />, 
      label: 'Downloads', 
      value: formatNumber(dashboardData?.downloads || 0), 
      change: '+45 this week',
      color: 'orange',
      trend: 'up'
    },
    { 
      icon: <Star size={24} />, 
      label: 'Avg. Rating', 
      value: dashboardData?.avgRating?.toFixed(1) || '4.8', 
      change: '+0.2',
      color: 'yellow',
      trend: 'up'
    },
    { 
      icon: <DollarSign size={24} />, 
      label: 'Revenue', 
      value: `$${formatNumber(dashboardData?.revenue || 0)}`, 
      change: '+15%',
      color: 'teal',
      trend: 'up'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'content', label: 'My Content', icon: <FileText size={18} /> },
    { id: 'students', label: 'Students', icon: <Users size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
  ];

  const recentActivities = [
    { activity: 'New student enrolled in "Advanced Calculus"', time: '2 hours ago', type: 'enrollment' },
    { activity: 'Course "Physics 101" reached 1000 views', time: '1 day ago', type: 'milestone' },
    { activity: 'Received 5-star review from Sarah Johnson', time: '2 days ago', type: 'review' },
    { activity: 'Published new course "Chemistry Basics"', time: '3 days ago', type: 'publication' },
  ];

  const quickActions = [
    { label: 'Create Course', icon: <FileText size={20} />, color: 'blue' },
    { label: 'Upload Content', icon: <Upload size={20} />, color: 'green' },
    { label: 'View Reports', icon: <BarChart3 size={20} />, color: 'purple' },
    { label: 'Message Students', icon: <MessageSquare size={20} />, color: 'orange' },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <div className="dashboard-stats-grid">
              {teacherStats.map((stat, index) => (
                <div key={index} className={`dashboard-stat-card ${stat.color}`}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                    <span className={`stat-change ${stat.trend}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-main-content">
              <div className="content-section">
                <ContentManager content={userContent} loading={loading} />
              </div>
              <div className="analytics-section">
                <Analytics timeRange={timeRange} />
              </div>
            </div>
          </>
        );
      case 'content':
        return <ContentManager content={userContent} loading={loading} fullView />;
      case 'analytics':
        return <Analytics timeRange={timeRange} detailed />;
      default:
        return (
          <div className="coming-soon">
            <h3>Coming Soon</h3>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Teacher Dashboard</h1>
          <p>Welcome back, {user?.name || 'Teacher'}! Here's your teaching overview.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <FileText size={18} />
            Create New Content
          </button>
          <div className="time-range-selector">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className={`quick-action-btn ${action.color}`}>
              <div className="action-icon">{action.icon}</div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {renderTabContent()}

      {activeTab === 'overview' && (
        <div className="dashboard-sidebar">
          <div className="recent-activity">
            <h3>
              <Clock size={20} />
              Recent Activity
            </h3>
            <ul className="activity-list">
              {recentActivities.map((activity, index) => (
                <li key={index} className={`activity-item ${activity.type}`}>
                  <div className="activity-content">
                    <p>{activity.activity}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="upcoming-events">
            <h3>
              <Calendar size={20} />
              Upcoming Events
            </h3>
            <div className="events-list">
              <div className="event-item">
                <div className="event-date">
                  <span className="day">15</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-details">
                  <h4>Live Q&A Session</h4>
                  <p>2:00 PM - 3:30 PM</p>
                </div>
                <button className="event-action">Join</button>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <span className="day">20</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-details">
                  <h4>Course Submission Deadline</h4>
                  <p>11:59 PM</p>
                </div>
                <button className="event-action">View</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;