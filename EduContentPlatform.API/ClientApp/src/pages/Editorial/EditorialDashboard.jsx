import React, { useState, useEffect } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import './editorial.css';

const EditorialDashboard = () => {
  const [queue, setQueue] = useState([
    {
      id: 1,
      title: 'Advanced Machine Learning Algorithms',
      author: 'Dr. Sarah Johnson',
      type: 'research',
      submittedAt: '2024-01-15',
      status: 'pending',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Climate Change Analysis',
      author: 'Prof. Robert Smith',
      type: 'article',
      submittedAt: '2024-01-14',
      status: 'reviewing',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Introduction to Quantum Computing',
      author: 'Emma Wilson',
      type: 'course',
      submittedAt: '2024-01-13',
      status: 'pending',
      priority: 'low',
    },
  ]);

  const [stats, setStats] = useState({
    pendingReview: 12,
    inReview: 5,
    approved: 243,
    rejected: 18,
  });

  return (
    <div className="editorial-dashboard">
        <h2>Editorial Dashboard</h2>

        {/* Stats */}
        <div className="editorial-stats">
          <div className="stat-card">
            <h4>Pending Review</h4>
            <p className="count">{stats.pendingReview}</p>
          </div>
          <div className="stat-card">
            <h4>In Review</h4>
            <p className="count">{stats.inReview}</p>
          </div>
          <div className="stat-card">
            <h4>Approved</h4>
            <p className="count">{stats.approved}</p>
          </div>
          <div className="stat-card">
            <h4>Rejected</h4>
            <p className="count">{stats.rejected}</p>
          </div>
        </div>

        {/* Review Queue */}
        <section className="queue-section">
          <div className="section-header">
            <h3>Content Review Queue</h3>
            <select className="queue-filter">
              <option>All Items</option>
              <option>Pending</option>
              <option>In Review</option>
              <option>High Priority</option>
            </select>
          </div>

          <div className="queue-table-wrapper">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map(item => (
                  <tr key={item.id}>
                    <td className="title-cell">{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.type}</td>
                    <td>{new Date(item.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${item.priority}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                            <Button variant="ghost" size="sm" onClick={async () => {
                              // Open a prompt to submit a quick review (demo)
                              const decision = window.prompt('Enter review decision (approve/reject/revision):', 'approve');
                              if (!decision) return;
                              try {
                                const payload = { itemId: item.id, decision };
                                const { editorialService } = await import('../../services/api/editorial');
                                await editorialService.approveContent(payload);
                                alert('Review submitted');
                              } catch (e) {
                                console.error(e);
                                alert('Review failed');
                              }
                            }}>Review</Button>

                            <Button variant="ghost" size="sm" onClick={async () => {
                              const editorId = window.prompt('Enter editor userId to assign to:');
                              if (!editorId) return;
                              try {
                                const { contentService } = await import('../../services/api/content');
                                await contentService.assignToEditor('publication', item.id, Number(editorId));
                                alert('Assigned to editor');
                              } catch (e) {
                                console.error(e);
                                alert('Assign failed');
                              }
                            }}>Assign</Button>
                          </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Button variant="secondary" to="/editorial/queue">
              View Full Queue
            </Button>
            <Button variant="secondary" to="/editorial/assign">
              Assign Reviewers
            </Button>
            <Button variant="secondary" to="/editorial/settings">
              Editorial Settings
            </Button>
          </div>
        </section>
      </div>
  );
};

export default EditorialDashboard;
