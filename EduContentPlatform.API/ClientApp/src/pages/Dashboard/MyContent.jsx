import React, { useState, useEffect } from 'react';
// DashboardLayout provided by router
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/UI/Button/Button';
import './dashboard.css';

const MyContent = () => {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setContent([
        {
          id: 1,
          title: 'Introduction to React',
          type: 'course',
          status: 'published',
          views: 450,
          students: 125,
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          title: 'Advanced JavaScript Patterns',
          type: 'course',
          status: 'draft',
          views: 0,
          students: 0,
          createdAt: '2024-02-10',
        },
        {
          id: 3,
          title: 'Web Development Bootcamp',
          type: 'course',
          status: 'published',
          views: 1200,
          students: 340,
          createdAt: '2024-03-05',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredContent = filterStatus === 'all'
    ? content
    : content.filter(item => item.status === filterStatus);

  if (loading) {
    return (
      <div className="loading-state">Loading your content...</div>
    );
  }

  return (
    <div className="content-management">
        <div className="content-header">
          <h2>My Content</h2>
          <Button variant="primary" to="/upload">
            Upload New Content
          </Button>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({content.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'published' ? 'active' : ''}`}
            onClick={() => setFilterStatus('published')}
          >
            Published
          </button>
          <button
            className={`filter-btn ${filterStatus === 'draft' ? 'active' : ''}`}
            onClick={() => setFilterStatus('draft')}
          >
            Draft
          </button>
        </div>

        {filteredContent.length === 0 ? (
          <div className="empty-state">
            <p>No content found</p>
            <Button variant="primary" to="/upload">Upload Content</Button>
          </div>
        ) : (
          <div className="content-table-wrapper">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Students</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map(item => (
                  <tr key={item.id}>
                    <td className="title-cell">{item.title}</td>
                    <td>{item.type}</td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.views}</td>
                    <td>{item.students}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
};

export default MyContent;
