import React, { useState, useEffect } from 'react';
import { useReview } from '../../../hooks/useReview';

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const { getFeedback, respondToFeedback } = useReview();

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getFeedback({ filter });
      setFeedbacks(data);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (feedbackId) => {
    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }

    try {
      await respondToFeedback(feedbackId, responseText);
      setResponseText('');
      fetchFeedbacks();
      alert('Response sent successfully!');
    } catch (error) {
      console.error('Failed to send response:', error);
      alert('Failed to send response');
    }
  };

  const markAsResolved = async (feedbackId) => {
    try {
      // Implementation for marking feedback as resolved
      console.log('Mark as resolved:', feedbackId);
    } catch (error) {
      console.error('Failed to mark as resolved:', error);
    }
  };

  const getFeedbackTypeIcon = (type) => {
    const icons = {
      'praise': 'icon-thumbs-up',
      'criticism': 'icon-thumbs-down',
      'suggestion': 'icon-lightbulb',
      'question': 'icon-help-circle',
      'clarification': 'icon-message-circle'
    };
    return icons[type] || 'icon-message-square';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'new': 'badge-primary',
      'pending': 'badge-warning',
      'resolved': 'badge-success',
      'closed': 'badge-secondary'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading && feedbacks.length === 0) {
    return <div className="loading-state">Loading feedback...</div>;
  }

  return (
    <div className="feedback-manager">
      {/* Header */}
      <div className="feedback-header">
        <h2>Feedback Manager</h2>
        <div className="feedback-stats">
          <div className="stat">
            <span className="stat-number">{feedbacks.length}</span>
            <span className="stat-label">Total Feedback</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {feedbacks.filter(f => f.status === 'new').length}
            </span>
            <span className="stat-label">New</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {feedbacks.filter(f => f.status === 'resolved').length}
            </span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="feedback-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Feedback
          </button>
          <button 
            className={`filter-tab ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            New
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending Response
          </button>
          <button 
            className={`filter-tab ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>
        
        <div className="filter-actions">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="praise">Praise</option>
            <option value="criticism">Criticism</option>
            <option value="suggestion">Suggestions</option>
            <option value="question">Questions</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <div className="empty-feedback">
            <i className="icon-message-square"></i>
            <h3>No feedback found</h3>
            <p>You haven't received any feedback yet.</p>
          </div>
        ) : (
          feedbacks.map(feedback => (
            <div 
              key={feedback.id} 
              className={`feedback-item ${feedback.status} ${selectedFeedback?.id === feedback.id ? 'selected' : ''}`}
              onClick={() => setSelectedFeedback(feedback)}
            >
              {/* Feedback Header */}
              <div className="feedback-item-header">
                <div className="sender-info">
                  <div className="sender-avatar">
                    {feedback.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="sender-details">
                    <div className="sender-name">{feedback.sender}</div>
                    <div className="sender-role">{feedback.role}</div>
                  </div>
                </div>
                
                <div className="feedback-meta">
                  <span className="feedback-date">{feedback.date}</span>
                  <span className={`feedback-type ${feedback.type}`}>
                    <i className={getFeedbackTypeIcon(feedback.type)}></i>
                    {feedback.type}
                  </span>
                  <span className={`status-badge ${getStatusBadge(feedback.status)}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>

              {/* Feedback Content */}
              <div className="feedback-content">
                <h4>{feedback.title}</h4>
                <p>{feedback.content}</p>
                
                {feedback.relatedReview && (
                  <div className="related-review">
                    <strong>Related Review:</strong> {feedback.relatedReview.title}
                  </div>
                )}
              </div>

              {/* Feedback Actions */}
              <div className="feedback-actions">
                {feedback.status !== 'resolved' && (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeedback(feedback);
                    }}
                  >
                    <i className="icon-message-circle"></i> Respond
                  </button>
                )}
                
                {feedback.status === 'new' && (
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsResolved(feedback.id);
                    }}
                  >
                    <i className="icon-check"></i> Mark Resolved
                  </button>
                )}
                
                <button className="btn btn-sm btn-outline">
                  <i className="icon-external-link"></i> View Review
                </button>
              </div>

              {/* Previous Responses */}
              {feedback.responses && feedback.responses.length > 0 && (
                <div className="feedback-responses">
                  <h5>Previous Responses:</h5>
                  {feedback.responses.map((response, index) => (
                    <div key={index} className="response-item">
                      <div className="response-header">
                        <span className="responder">{response.responder}</span>
                        <span className="response-date">{response.date}</span>
                      </div>
                      <p className="response-content">{response.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Response Panel */}
      {selectedFeedback && (
        <div className="response-panel">
          <div className="panel-header">
            <h3>Respond to Feedback</h3>
            <button 
              className="btn-close"
              onClick={() => {
                setSelectedFeedback(null);
                setResponseText('');
              }}
            >
              <i className="icon-close"></i>
            </button>
          </div>
          
          <div className="panel-content">
            <div className="original-feedback">
              <h4>Original Feedback</h4>
              <p><strong>From:</strong> {selectedFeedback.sender}</p>
              <p><strong>Type:</strong> {selectedFeedback.type}</p>
              <div className="feedback-text">
                {selectedFeedback.content}
              </div>
            </div>
            
            <div className="response-form">
              <h4>Your Response</h4>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
              />
              
              <div className="response-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleRespond(selectedFeedback.id)}
                  disabled={!responseText.trim()}
                >
                  <i className="icon-send"></i> Send Response
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setSelectedFeedback(null);
                    setResponseText('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => markAsResolved(selectedFeedback.id)}
                >
                  <i className="icon-check"></i> Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;