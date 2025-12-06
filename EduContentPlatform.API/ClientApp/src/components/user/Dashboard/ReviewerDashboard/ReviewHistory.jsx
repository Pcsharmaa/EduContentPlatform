import React, { useState, useEffect } from 'react';
import { useReview } from '../../../hooks/useReview';
import { formatDate } from '../../../utils/formatDate';

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    completionRate: 0
  });

  const { getReviewHistory, getReviewerStats } = useReview();

  useEffect(() => {
    fetchHistory();
  }, [filter, dateRange]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getReviewHistory({ 
        filter, 
        searchTerm, 
        dateRange 
      });
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch review history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getReviewerStats();
      setStats(data.historyStats || stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = () => {
    fetchHistory();
  };

  const handleExport = () => {
    // Implementation for exporting review history
    console.log('Exporting review history...');
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      'Accept': 'badge-success',
      'Minor Revision': 'badge-warning',
      'Major Revision': 'badge-warning',
      'Reject': 'badge-danger'
    };
    return badges[recommendation] || 'badge-secondary';
  };

  const getContentTypeIcon = (type) => {
    const icons = {
      'video': 'icon-video',
      'document': 'icon-file-text',
      'book': 'icon-book',
      'article': 'icon-file'
    };
    return icons[type] || 'icon-file';
  };

  if (loading && reviews.length === 0) {
    return <div className="loading-state">Loading review history...</div>;
  }

  return (
    <div className="review-history">
      {/* History Header */}
      <div className="history-header">
        <div className="header-left">
          <h2>Review History</h2>
          <p className="header-stats">
            {stats.total} total reviews • {stats.averageRating.toFixed(1)} avg rating • {stats.completionRate}% on time
          </p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-outline"
            onClick={handleExport}
          >
            <i className="icon-download"></i> Export History
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="history-filters">
        <div className="search-box">
          <i className="icon-search"></i>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <button 
              className="btn-clear"
              onClick={() => {
                setSearchTerm('');
                handleSearch();
              }}
            >
              <i className="icon-close"></i>
            </button>
          )}
        </div>
        
        <div className="filter-group">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Reviews</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="last_year">Last Year</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              placeholder="Start Date"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              placeholder="End Date"
            />
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleSearch}
          >
            <i className="icon-filter"></i> Apply
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Type</th>
              <th>Submitted</th>
              <th>Completed</th>
              <th>Time Spent</th>
              <th>Recommendation</th>
              <th>Editor Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  <i className="icon-search"></i>
                  <div>No reviews found</div>
                  <p>Try adjusting your filters or search terms</p>
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr 
                  key={review.id} 
                  className={`history-row ${selectedReview?.id === review.id ? 'selected' : ''}`}
                  onClick={() => setSelectedReview(review)}
                >
                  <td>
                    <div className="content-cell">
                      <i className={`content-icon ${getContentTypeIcon(review.contentType)}`}></i>
                      <div className="content-info">
                        <strong>{review.title}</strong>
                        <small>by {review.author}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="content-type">{review.contentType}</span>
                  </td>
                  <td>{formatDate(review.assignedDate)}</td>
                  <td>{formatDate(review.completedDate)}</td>
                  <td>
                    <div className="time-spent">
                      {review.timeSpent}
                      {review.overdue && (
                        <span className="overdue-indicator" title="Completed after deadline">
                          <i className="icon-clock"></i>
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`recommendation-badge ${getRecommendationBadge(review.recommendation)}`}>
                      {review.recommendation}
                    </span>
                  </td>
                  <td>
                    {review.editorFeedback ? (
                      <div className="feedback-rating">
                        <div className="star-rating">
                          {'★'.repeat(review.editorFeedback.rating)}
                          {'☆'.repeat(5 - review.editorFeedback.rating)}
                        </div>
                        <small>{review.editorFeedback.comment}</small>
                      </div>
                    ) : (
                      <span className="no-feedback">No feedback yet</span>
                    )}
                  </td>
                  <td>
                    <div className="history-actions">
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // View review details
                          console.log('View review:', review.id);
                        }}
                        title="View Review"
                      >
                        <i className="icon-eye"></i>
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download review
                          console.log('Download review:', review.id);
                        }}
                        title="Download"
                      >
                        <i className="icon-download"></i>
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // View content
                          console.log('View content:', review.contentId);
                        }}
                        title="View Content"
                      >
                        <i className="icon-external-link"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Review Details */}
      {selectedReview && (
        <div className="history-details">
          <div className="details-header">
            <h3>Review Details</h3>
            <button 
              className="btn-close"
              onClick={() => setSelectedReview(null)}
            >
              <i className="icon-close"></i>
            </button>
          </div>
          
          <div className="details-content">
            <div className="detail-section">
              <h4>Review Summary</h4>
              <p>{selectedReview.summary}</p>
            </div>
            
            <div className="detail-section">
              <h4>Scores</h4>
              <div className="scores-grid">
                {Object.entries(selectedReview.scores || {}).map(([criterion, score]) => (
                  <div key={criterion} className="score-item">
                    <span className="score-label">{criterion}:</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ width: `${(score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{score}/10</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Comments</h4>
              <div className="comments-section">
                <div className="comment-type">
                  <h5>Major Comments:</h5>
                  <p>{selectedReview.majorComments || 'None provided'}</p>
                </div>
                <div className="comment-type">
                  <h5>Minor Comments:</h5>
                  <p>{selectedReview.minorComments || 'None provided'}</p>
                </div>
              </div>
            </div>
            
            {selectedReview.editorFeedback && (
              <div className="detail-section">
                <h4>Editor Feedback</h4>
                <div className="editor-feedback">
                  <div className="feedback-header">
                    <span className="feedback-rating">
                      Rating: {selectedReview.editorFeedback.rating}/5
                    </span>
                    <span className="feedback-date">
                      {formatDate(selectedReview.editorFeedback.date)}
                    </span>
                  </div>
                  <p className="feedback-comment">{selectedReview.editorFeedback.comment}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;