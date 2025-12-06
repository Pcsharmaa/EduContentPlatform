import React, { useState, useEffect } from 'react';
import { useEditorial } from '../../../hooks/useEditorial';

const ContentApproval = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [filter, setFilter] = useState('all');

  const { getPendingApprovals, approveContent, rejectContent } = useEditorial();

  useEffect(() => {
    fetchPendingApprovals();
  }, [filter]);

  const fetchPendingApprovals = async () => {
    try {
      const data = await getPendingApprovals({ filter });
      setPendingApprovals(data);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    }
  };

  const handleApprove = async (contentId) => {
    try {
      await approveContent(contentId, approvalNotes);
      setApprovalNotes('');
      setSelectedItem(null);
      fetchPendingApprovals();
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const handleReject = async (contentId) => {
    if (!approvalNotes) {
      alert('Please provide rejection notes');
      return;
    }

    try {
      await rejectContent(contentId, approvalNotes);
      setApprovalNotes('');
      setSelectedItem(null);
      fetchPendingApprovals();
    } catch (error) {
      console.error('Failed to reject content:', error);
    }
  };

  const handleRequestRevision = async (contentId) => {
    // Implementation for requesting revisions
    console.log('Request revision for:', contentId);
  };

  return (
    <div className="content-approval">
      <div className="approval-header">
        <h2>Content Approval</h2>
        <div className="approval-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Content</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="article">Articles</option>
            <option value="urgent">Urgent Review</option>
          </select>
          <button onClick={fetchPendingApprovals} className="btn btn-sm">
            Refresh
          </button>
        </div>
      </div>

      <div className="approval-container">
        {/* Left Panel - List of pending approvals */}
        <div className="approval-list">
          <h3>Pending Approval ({pendingApprovals.length})</h3>
          <div className="list-items">
            {pendingApprovals.map(item => (
              <div 
                key={item.id}
                className={`approval-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-header">
                  <h4>{item.title}</h4>
                  <span className={`priority ${item.priority}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="item-details">
                  <p className="author">By: {item.author}</p>
                  <div className="meta-info">
                    <span>Type: {item.type}</span>
                    <span>Submitted: {item.submittedDate}</span>
                    <span>Reviewers: {item.reviewers.length}</span>
                  </div>
                </div>
                <div className="review-summary">
                  {item.reviewers.map(reviewer => (
                    <div key={reviewer.id} className="reviewer-badge">
                      {reviewer.name}: {reviewer.recommendation}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Review and Approval */}
        <div className="approval-details">
          {selectedItem ? (
            <>
              <div className="details-header">
                <h3>{selectedItem.title}</h3>
                <div className="content-meta">
                  <span>Type: {selectedItem.type}</span>
                  <span>Category: {selectedItem.category}</span>
                  <span>Priority: {selectedItem.priority}</span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="content-preview">
                <h4>Content Preview</h4>
                <div className="preview-container">
                  {selectedItem.type === 'video' && (
                    <video controls>
                      <source src={selectedItem.previewUrl} type="video/mp4" />
                    </video>
                  )}
                  {selectedItem.type === 'document' && (
                    <iframe 
                      src={selectedItem.previewUrl} 
                      title={selectedItem.title}
                      className="document-preview"
                    />
                  )}
                  <p>{selectedItem.description}</p>
                </div>
              </div>

              {/* Reviewers Feedback */}
              <div className="reviewer-feedback">
                <h4>Reviewers Feedback</h4>
                {selectedItem.reviews.map(review => (
                  <div key={review.id} className="feedback-item">
                    <div className="reviewer-header">
                      <strong>{review.reviewerName}</strong>
                      <span className={`recommendation ${review.recommendation}`}>
                        {review.recommendation}
                      </span>
                    </div>
                    <p className="feedback-text">{review.comments}</p>
                    <div className="review-scores">
                      {Object.entries(review.scores).map(([key, value]) => (
                        <div key={key} className="score-item">
                          <span>{key}:</span>
                          <span className="score-value">{value}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Approval Actions */}
              <div className="approval-actions">
                <div className="action-notes">
                  <label>Approval Notes</label>
                  <textarea 
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add your notes for approval or rejection..."
                    rows={4}
                  />
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleApprove(selectedItem.id)}
                  >
                    Approve Content
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleReject(selectedItem.id)}
                  >
                    Reject Content
                  </button>
                  <button 
                    className="btn btn-warning"
                    onClick={() => handleRequestRevision(selectedItem.id)}
                  >
                    Request Revision
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setSelectedItem(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select an item from the list to review and approve</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentApproval;