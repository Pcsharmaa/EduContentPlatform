import React, { useState, useEffect } from 'react';
import PublicationManager from './PublicationManager';
import ResearchTools from './ResearchTools';
import { useContent } from '../../../../hooks/useContent';
import { useAuth } from '../../../../hooks/useAuth';
import {
  FileText, Users, TrendingUp, Globe,
  Award, BarChart3, Calendar, BookOpen,
  Search, Download, Share2, Citation,
  Database, Target, Clock, Star
} from 'lucide-react';
import './ScholarDashboard.css';

const ScholarDashboard = () => {
  const { user } = useAuth();
  const { publications, loading, fetchScholarDashboard } = useContent();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1y');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchScholarDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadDashboardData();
  }, [fetchScholarDashboard]);

  const scholarStats = [
    {
      icon: <FileText size={24} />,
      label: 'Total Publications',
      value: dashboardData?.totalPublications || 0,
      change: '+3 this year',
      color: 'blue',
      trend: 'up'
    },
    {
      icon: <Citation size={24} />,
      label: 'Total Citations',
      value: dashboardData?.totalCitations || 0,
      change: '+45 recent',
      color: 'green',
      trend: 'up'
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'H-Index',
      value: dashboardData?.hIndex || 0,
      change: '+2 points',
      color: 'purple',
      trend: 'up'
    },
    {
      icon: <Globe size={24} />,
      label: 'Collaborations',
      value: dashboardData?.collaborations || 0,
      change: '+5 new',
      color: 'orange',
      trend: 'up'
    },
    {
      icon: <Download size={24} />,
      label: 'Total Downloads',
      value: formatNumber(dashboardData?.downloads || 0),
      change: '+12%',
      color: 'teal',
      trend: 'up'
    },
    {
      icon: <Star size={24} />,
      label: 'Impact Factor',
      value: dashboardData?.impactFactor?.toFixed(2) || '4.25',
      change: '+0.15',
      color: 'yellow',
      trend: 'up'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'publications', label: 'Publications', icon: <FileText size={18} /> },
    { id: 'research', label: 'Research Tools', icon: <Search size={18} /> },
    { id: 'collaborations', label: 'Collaborations', icon: <Users size={18} /> },
    { id: 'grants', label: 'Grants & Funding', icon: <Award size={18} /> },
  ];

  const recentActivities = [
    { activity: 'Paper accepted in "Nature Journal"', time: '2 days ago', type: 'acceptance' },
    { activity: 'New citation for 2023 research paper', time: '1 week ago', type: 'citation' },
    { activity: 'Research grant proposal submitted', time: '2 weeks ago', type: 'grant' },
    { activity: 'Collaboration established with MIT', time: '3 weeks ago', type: 'collaboration' },
  ];

  const upcomingDeadlines = [
    { title: 'Conference Paper Submission', date: '2024-02-15', priority: 'high' },
    { title: 'Grant Application Deadline', date: '2024-03-01', priority: 'high' },
    { title: 'Journal Review Submission', date: '2024-02-28', priority: 'medium' },
    { title: 'Research Progress Report', date: '2024-02-20', priority: 'low' },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getDaysUntil = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <div className="dashboard-stats-grid">
              {scholarStats.map((stat, index) => (
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
                <PublicationManager publications={publications} loading={loading} />
              </div>
              <div className="tools-section">
                <ResearchTools />
              </div>
            </div>
          </>
        );
      case 'publications':
        return <PublicationManager publications={publications} loading={loading} fullView />;
      case 'research':
        return <ResearchTools detailed />;
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
    <div className="scholar-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Research Dashboard</h1>
          <p>Welcome back, Dr. {user?.name || 'Researcher'}! Track your research impact and publications.</p>
          <div className="header-badges">
            <span className="badge">
              <Award size={16} />
              Senior Researcher
            </span>
            <span className="badge">
              <Globe size={16} />
              International Collaborator
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <FileText size={18} />
            Submit New Paper
          </button>
          <div className="time-range-selector">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
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
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <h4>Research Goals</h4>
              <p>3 of 5 targets met</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h4>Active Projects</h4>
              <p>4 ongoing research projects</p>
              <span className="stat-detail">2 nearing completion</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Database size={24} />
            </div>
            <div className="stat-content">
              <h4>Datasets</h4>
              <p>8 research datasets</p>
              <span className="stat-detail">3 public, 5 private</span>
            </div>
          </div>
        </div>
      )}

      {renderTabContent()}

      {activeTab === 'overview' && (
        <div className="dashboard-sidebar">
          <div className="recent-activity">
            <h3>
              <Clock size={20} />
              Research Activity
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

          <div className="upcoming-deadlines">
            <h3>
              <Calendar size={20} />
              Upcoming Deadlines
            </h3>
            <div className="deadlines-list">
              {upcomingDeadlines.map((deadline, index) => {
                const daysUntil = getDaysUntil(deadline.date);
                return (
                  <div key={index} className="deadline-item">
                    <div className="deadline-info">
                      <h4>{deadline.title}</h4>
                      <div className="deadline-meta">
                        <span className="deadline-date">
                          Due: {new Date(deadline.date).toLocaleDateString()}
                        </span>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(deadline.priority) }}
                        >
                          {deadline.priority}
                        </span>
                      </div>
                    </div>
                    <div className="deadline-countdown">
                      <span className={`days ${daysUntil <= 7 ? 'urgent' : ''}`}>
                        {daysUntil} days
                      </span>
                      <button className="deadline-action">View</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="collaboration-network">
            <h3>
              <Users size={20} />
              Top Collaborators
            </h3>
            <div className="collaborators-list">
              <div className="collaborator">
                <div className="collaborator-avatar">JD</div>
                <div className="collaborator-info">
                  <h4>Dr. Jane Doe</h4>
                  <p>Stanford University • 8 joint papers</p>
                </div>
              </div>
              <div className="collaborator">
                <div className="collaborator-avatar">RS</div>
                <div className="collaborator-info">
                  <h4>Prof. Robert Smith</h4>
                  <p>MIT • 5 joint projects</p>
                </div>
              </div>
              <div className="collaborator">
                <div className="collaborator-avatar">ML</div>
                <div className="collaborator-info">
                  <h4>Dr. Maria Lopez</h4>
                  <p>Cambridge • 12 citations</p>
                </div>
              </div>
            </div>
            <button className="view-network">
              <Share2 size={16} />
              View Full Network
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarDashboard;