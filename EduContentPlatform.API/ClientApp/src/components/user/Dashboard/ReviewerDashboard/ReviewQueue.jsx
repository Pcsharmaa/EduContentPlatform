import React, { useState, useEffect } from 'react';
import { useReview } from '../../../hooks/useReview';
import { formatDate, timeAgo } from '../../../utils/formatDate';

const ReviewQueue = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const { getReviewQueue, startReview } = useReview();

  useEffect(() => {
    fetchReviewQueue();
  }, [filter, sortBy]);

  const fetchReviewQueue = async () => {
    setLoading(true);
    try {
      const data = await getReviewQueue({ filter, sortBy });
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch review queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = async (reviewId) => {
    try {
      await startReview(reviewId);
      // Navigate to review form or refresh queue
      fetchReviewQueue();
    } catch (error) {
      console.error('Failed to start review:', error);
    }
  };

  const handleDeclineReview = async (reviewId, reason) => {
    // Implementation for declining a review
    console.log('Decline review:', reviewId, reason);
  };

  const handleRequestExtension = async (reviewId) => {
    // Implementation for requesting deadline extension
    console.log('Request extension for:', reviewId);
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { class: 'badge-high', label: 'High' },
      medium: { class: 'badge-medium', label: 'Medium' },
      low: { class: 'badge-low', label: 'Low' }
    };
    return badges[priority] || { class: 'badge-default', label: priority };
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="loading-state">Loading review queue...</div>;
  }

  return (
    <div className="review-queue">
      {/* Queue Header with Filters */}
      <div className="queue-header">
        <h2>My Review Queue</h2>
        <div className="queue-controls">
          <div className="filter-group">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="submitted">Sort by Submitted Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
          
          <button 
            onClick={fetchReviewQueue}
            className="btn btn-refresh"
          >
            <i className="icon-refresh"></i> Refresh
          </button>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="reviews-grid">
        {reviews.length === 0 ? (
          <div className="empty-queue">
            <i className="icon-check-circle"></i>
            <h3>No reviews in queue</h3>
            <p>You're all caught up! New assignments will appear here.</p>
          </div>
        ) : (
          reviews.map((review) => {
            const daysLeft = getDaysUntilDeadline(review.deadline);
            const priority = getPriorityBadge(review.priority);
            
            return (
              <div 
                key={review.id} 
                className={`review-card ${review.status} ${selectedReview?.id === review.id ? 'selected' : ''}`}
                onClick={() => setSelectedReview(review)}
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className="content-type">
                    <span className={`type-badge ${review.contentType}`}>
                      {review.contentType}
                    </span>
                  </div>
                  <div className="card-actions">
                    <span className={`priority-badge ${priority.class}`}>
                      {priority.label}
                    </span>
                    {review.status === 'overdue' && (
                      <span className="overdue-badge">Overdue</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <h3 className="review-title">{review.title}</h3>
                  <p className="review-description">{review.description}</p>
                  
                  <div className="review-meta">
                    <div className="meta-item">
                      <i className="icon-user"></i>
                      <span>Author: {review.author}</span>
                    </div>
                    <div className="meta-item">
                      <i className="icon-category"></i>
                      <span>{review.category}</span>
                    </div>
                    <div className="meta-item">
                      <i className="icon-file"></i>
                      <span>{review.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="deadline-info">
                    <i className="icon-clock"></i>
                    <div className="deadline-details">
                      <div className="deadline-label">Deadline</div>
                      <div className={`deadline-time ${daysLeft <= 2 ? 'urgent' : ''}`}>
                        {formatDate(review.deadline)}
                        {daysLeft > 0 && (
                          <span className="days-left"> ({daysLeft} days left)</span>
                        )}
                        {daysLeft <= 0 && (
                          <span className="days-left overdue"> Overdue!</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    {review.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartReview(review.id);
                          }}
                        >
                          <i className="icon-play"></i> Start Review
                        </button>
                        <button 
                          className="btn btn-decline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineReview(review.id, 'busy');
                          }}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    
                    {review.status === 'in_progress' && (
                      <button 
                        className="btn btn-continue"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartReview(review.id);
                        }}
                      >
                        <i className="icon-edit"></i> Continue Review
                      </button>
                    )}
                    
                    {review.status === 'overdue' && (
                      <button 
                        className="btn btn-extension"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestExtension(review.id);
                        }}
                      >
                        Request Extension
                      </button>
                    )}
                    
                    {review.status === 'completed' && (
                      <button className="btn btn-view">
                        <i className="icon-eye"></i> View Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Review Details Panel */}
      {selectedReview && (
        <div className="review-details-panel">
          <div className="panel-header">
            <h3>Review Details</h3>
            <button 
              className="btn-close"
              onClick={() => setSelectedReview(null)}
            >
              <i className="icon-close"></i>
            </button>
          </div>
          
          <div className="panel-content">
            <div className="detail-section">
              <h4>Assignment Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Assigned By:</label>
                  <span>{selectedReview.assignedBy}</span>
                </div>
                <div className="detail-item">
                  <label>Assigned On:</label>
                  <span>{formatDate(selectedReview.assignedDate)}</span>
                </div>
                <div className="detail-item">
                  <label>Estimated Time:</label>
                  <span>{selectedReview.estimatedTime} hours</span>
                </div>
                <div className="detail-item">
                  <label>Review Guidelines:</label>
                  <span>{selectedReview.guidelines}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Content Information</h4>
              <div className="content-preview">
                <p><strong>Abstract:</strong> {selectedReview.abstract}</p>
                <div className="keywords">
                  <strong>Keywords:</strong>
                  {selectedReview.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Additional Notes</h4>
              <p className="assignment-notes">{selectedReview.notes}</p>
            </div>
          </div>
          
          <div className="panel-actions">
            <button className="btn btn-primary">
              <i className="icon-download"></i> Download Content
            </button>
            <button className="btn btn-secondary">
              <i className="icon-message"></i> Contact Editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;