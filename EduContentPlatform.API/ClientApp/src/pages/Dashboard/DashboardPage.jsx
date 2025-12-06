import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/UI/Button/Button';
import './dashboard.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalEarnings: 0,
    pendingReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalContent: 24,
        totalViews: 5280,
        totalEarnings: 450.50,
        pendingReviews: 3,
      });
      setRecentActivity([
        { id: 1, action: 'Content uploaded', date: '2 hours ago' },
        { id: 2, action: 'Review submitted', date: '1 day ago' },
        { id: 3, action: 'Content approved', date: '2 days ago' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome back, {user?.firstName}! 👋</h2>
        <p>Here's what's happening with your account today.</p>
      </section>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <p className="stat-label">Total Content</p>
              <h3 className="stat-value">{stats.totalContent}</h3>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <p className="stat-label">Total Views</p>
              <h3 className="stat-value">{stats.totalViews.toLocaleString()}</h3>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-label">Total Earnings</p>
              <h3 className="stat-value">${stats.totalEarnings.toFixed(2)}</h3>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <p className="stat-label">Pending Reviews</p>
              <h3 className="stat-value">{stats.pendingReviews}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Button variant="primary" to="/upload" size="lg">
            ⬆️ Upload New Content
          </Button>
          <Button variant="secondary" to="/dashboard/content" size="lg">
            📄 View My Content
          </Button>
          {user?.role === 'admin' && (
            <Button variant="secondary" to="/admin" size="lg">
              👑 Admin Panel
            </Button>
          )}
          {['editor', 'reviewer'].includes(user?.role) && (
            <Button variant="secondary" to="/editorial" size="lg">
              ✏️ Editorial Dashboard
            </Button>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-date">{activity.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">No recent activity</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
