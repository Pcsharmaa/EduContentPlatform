import React, { useState, useEffect } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import './dashboard.css';

const MyPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPublications([
        {
          id: 1,
          title: 'Advances in Machine Learning',
          type: 'Journal Article',
          journal: 'International Review of AI',
          status: 'published',
          date: '2024-01-20',
          citations: 15,
        },
        {
          id: 2,
          title: 'Climate Change Models',
          type: 'Research Paper',
          journal: 'Environmental Science Quarterly',
          status: 'under review',
          date: '2024-02-15',
          citations: 0,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="loading-state">Loading publications...</div>
    );
  }

  return (
    <div className="publications-management">
        <div className="content-header">
          <h2>My Publications</h2>
          <Button variant="primary" to="/upload">
            Submit Publication
          </Button>
        </div>

        {publications.length === 0 ? (
          <div className="empty-state">
            <p>No publications yet</p>
            <Button variant="primary" to="/upload">Submit Your Work</Button>
          </div>
        ) : (
          <div className="publications-grid">
            {publications.map(pub => (
              <div key={pub.id} className="publication-card">
                <div className="pub-header">
                  <h3>{pub.title}</h3>
                  <span className={`status-badge ${pub.status.replace(' ', '-')}`}>
                    {pub.status}
                  </span>
                </div>
                <p className="pub-meta">
                  <strong>Type:</strong> {pub.type}
                </p>
                <p className="pub-meta">
                  <strong>Journal:</strong> {pub.journal}
                </p>
                <p className="pub-meta">
                  <strong>Date:</strong> {new Date(pub.date).toLocaleDateString()}
                </p>
                <p className="pub-meta">
                  <strong>Citations:</strong> {pub.citations}
                </p>
                <div className="pub-actions">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default MyPublications;
