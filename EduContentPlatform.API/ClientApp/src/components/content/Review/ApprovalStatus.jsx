import React from 'react';
import { REVIEW_STATUS, REVIEW_STATUS_DISPLAY } from '../../../constants/reviewStatus';
import { dateUtils } from '../../../services/utils/formatDate';
import './review.css';

const ApprovalStatus = ({ 
  status,
  history = [],
  currentStep = 0,
  totalSteps = 5,
  lastUpdated,
  reviewer,
  nextAction,
  onActionClick,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case REVIEW_STATUS.PENDING:
        return '#f59e0b';
      case REVIEW_STATUS.UNDER_REVIEW:
        return '#3b82f6';
      case REVIEW_STATUS.REVISIONS_NEEDED:
        return '#8b5cf6';
      case REVIEW_STATUS.APPROVED:
        return '#10b981';
      case REVIEW_STATUS.REJECTED:
        return '#ef4444';
      case REVIEW_STATUS.PUBLISHED:
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case REVIEW_STATUS.PENDING:
        return '⏳';
      case REVIEW_STATUS.UNDER_REVIEW:
        return '🔍';
      case REVIEW_STATUS.REVISIONS_NEEDED:
        return '✏️';
      case REVIEW_STATUS.APPROVED:
        return '✅';
      case REVIEW_STATUS.REJECTED:
        return '❌';
      case REVIEW_STATUS.PUBLISHED:
        return '📢';
      default:
        return '📋';
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const steps = [
    { label: 'Submitted', description: 'Content submitted for review' },
    { label: 'Under Review', description: 'Reviewers evaluating content' },
    { label: 'Feedback', description: 'Author receives feedback' },
    { label: 'Decision', description: 'Editor makes final decision' },
    { label: 'Published', description: 'Content is live' },
  ];

  return (
    <div className="approval-status">
      {/* Current Status */}
      <div className="status-header">
        <div className="status-icon" style={{ color: getStatusColor() }}>
          {getStatusIcon()}
        </div>
        <div className="status-info">
          <h3 className="status-title">
            {REVIEW_STATUS_DISPLAY[status] || 'Unknown Status'}
          </h3>
          {lastUpdated && (
            <div className="status-updated">
              Last updated: {dateUtils.formatForDisplay(lastUpdated)}
            </div>
          )}
          {reviewer && (
            <div className="status-reviewer">
              Reviewer: {reviewer}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${getProgressPercentage()}%`,
              backgroundColor: getStatusColor(),
            }}
          />
        </div>
        <div className="progress-steps">
          {steps.slice(0, totalSteps).map((step, index) => (
            <div 
              key={index}
              className={`progress-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
            >
              <div className="step-dot" />
              <div className="step-label">{step.label}</div>
              <div className="step-description">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Action */}
      {nextAction && (
        <div className="next-action">
          <h4 className="next-action-title">Next Action</h4>
          <p className="next-action-description">{nextAction.description}</p>
          {onActionClick && (
            <button
              onClick={onActionClick}
              className="action-button"
            >
              {nextAction.buttonText || 'Take Action'}
            </button>
          )}
        </div>
      )}

      {/* Status History */}
      {history.length > 0 && (
        <div className="status-history">
          <h4 className="history-title">Status History</h4>
          <div className="history-list">
            {history.map((entry, index) => (
              <div key={index} className="history-item">
                <div className="history-icon">
                  {entry.status === REVIEW_STATUS.APPROVED ? '✅' : 
                   entry.status === REVIEW_STATUS.REJECTED ? '❌' : 
                   entry.status === REVIEW_STATUS.REVISIONS_NEEDED ? '✏️' : '📋'}
                </div>
                <div className="history-content">
                  <div className="history-status">
                    {REVIEW_STATUS_DISPLAY[entry.status]}
                  </div>
                  <div className="history-details">
                    {entry.actionBy && (
                      <span className="history-by">{entry.actionBy}</span>
                    )}
                    {entry.timestamp && (
                      <span className="history-time">
                        {dateUtils.formatForDisplay(entry.timestamp)}
                      </span>
                    )}
                  </div>
                  {entry.notes && (
                    <div className="history-notes">{entry.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Legend */}
      <div className="status-legend">
        <div className="legend-title">Status Legend</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color pending" />
            <span className="legend-label">Pending Review</span>
          </div>
          <div className="legend-item">
            <span className="legend-color under-review" />
            <span className="legend-label">Under Review</span>
          </div>
          <div className="legend-item">
            <span className="legend-color revisions" />
            <span className="legend-label">Revisions Needed</span>
          </div>
          <div className="legend-item">
            <span className="legend-color approved" />
            <span className="legend-label">Approved</span>
          </div>
          <div className="legend-item">
            <span className="legend-color rejected" />
            <span className="legend-label">Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStatus;