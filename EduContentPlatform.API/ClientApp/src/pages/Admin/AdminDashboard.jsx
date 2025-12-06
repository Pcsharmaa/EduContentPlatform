import React, { useState, useEffect } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import './admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 2540,
    totalContent: 1250,
    pendingReviews: 34,
    totalRevenue: 45230.50,
    activeNow: 127,
  });

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: 'John Doe', role: 'teacher', joinedAt: '2024-01-15', status: 'active' },
    { id: 2, name: 'Jane Smith', role: 'scholar', joinedAt: '2024-01-14', status: 'active' },
    { id: 3, name: 'Bob Johnson', role: 'student', joinedAt: '2024-01-13', status: 'inactive' },
  ]);

  return (
    <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <h4>Total Users</h4>
            <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
            <span className="stat-change">+12% this month</span>
          </div>
          <div className="stat-box">
            <h4>Total Content</h4>
            <p className="stat-value">{stats.totalContent.toLocaleString()}</p>
            <span className="stat-change">+5% this week</span>
          </div>
          <div className="stat-box">
            <h4>Pending Reviews</h4>
            <p className="stat-value">{stats.pendingReviews}</p>
            <span className="stat-change">2 urgent</span>
          </div>
          <div className="stat-box">
            <h4>Total Revenue</h4>
            <p className="stat-value">${stats.totalRevenue.toFixed(0)}</p>
            <span className="stat-change">+8% this month</span>
          </div>
        </div>

        {/* Management Sections */}
        <div className="management-sections">
          <section className="admin-section">
            <div className="section-header">
              <h3>User Management</h3>
              <Button variant="primary" to="/admin/users">View All</Button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-section">
            <div className="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="action-buttons">
              <Button variant="secondary" to="/admin/users">
                Manage Users
              </Button>
              <Button variant="secondary" to="/admin/content">
                Moderate Content
              </Button>
              <Button variant="secondary" to="/admin/analytics">
                View Analytics
              </Button>
              <Button variant="secondary" to="/admin/settings">
                System Settings
              </Button>
            </div>
          </section>
        </div>
      </div>
  );
};

export default AdminDashboard;
