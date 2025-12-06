import React, { useState } from 'react';
import { REVIEW_STATUS, REVIEW_STATUS_DISPLAY } from '../../../constants/reviewStatus';
import './review.css';

const ReviewPanel = ({ 
  content,
  onSubmit,
  onReject,
  onRequestRevision,
  reviewerNotes = '',
  isSubmitting = false,
  canApprove = true,
  canReject = true,
  canRequestRevision = true,
}) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comments: reviewerNotes || '',
    recommendation: '',
    privateNotes: '',
    strengths: [''],
    weaknesses: [''],
  });

  const [selectedStatus, setSelectedStatus] = useState('');

  const handleRatingChange = (rating) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleStrengthChange = (index, value) => {
    const newStrengths = [...reviewData.strengths];
    newStrengths[index] = value;
    setReviewData(prev => ({ ...prev, strengths: newStrengths }));
  };

  const addStrength = () => {
    setReviewData(prev => ({ ...prev, strengths: [...prev.strengths, ''] }));
  };

  const removeStrength = (index) => {
    const newStrengths = reviewData.strengths.filter((_, i) => i !== index);
    setReviewData(prev => ({ ...prev, strengths: newStrengths }));
  };

  const handleWeaknessChange = (index, value) => {
    const newWeaknesses = [...reviewData.weaknesses];
    newWeaknesses[index] = value;
    setReviewData(prev => ({ ...prev, weaknesses: newWeaknesses }));
  };

  const addWeakness = () => {
    setReviewData(prev => ({ ...prev, weaknesses: [...prev.weaknesses, ''] }));
  };

  const removeWeakness = (index) => {
    const newWeaknesses = reviewData.weaknesses.filter((_, i) => i !== index);
    setReviewData(prev => ({ ...prev, weaknesses: newWeaknesses }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSubmit = () => {
    if (selectedStatus === REVIEW_STATUS.APPROVED && onSubmit) {
      onSubmit({
        ...reviewData,
        status: REVIEW_STATUS.APPROVED,
      });
    } else if (selectedStatus === REVIEW_STATUS.REJECTED && onReject) {
      onReject({
        ...reviewData,
        status: REVIEW_STATUS.REJECTED,
      });
    } else if (selectedStatus === REVIEW_STATUS.REVISIONS_NEEDED && onRequestRevision) {
      onRequestRevision({
        ...reviewData,
        status: REVIEW_STATUS.REVISIONS_NEEDED,
      });
    }
  };

  const recommendations = [
    { value: '', label: 'Select recommendation' },
    { value: 'accept', label: 'Accept as is' },
    { value: 'minor_revisions', label: 'Accept with minor revisions' },
    { value: 'major_revisions', label: 'Revise and resubmit' },
    { value: 'reject', label: 'Reject' },
  ];

  return (
    <div className="review-panel">
      {/* Content Preview */}
      <div className="review-content-preview">
        <h3 className="content-title">{content?.title || 'Content Title'}</h3>
        <div className="content-meta">
          <span className="meta-item">By: {content?.author || 'Unknown Author'}</span>
          <span className="meta-item">Type: {content?.type || 'Unknown Type'}</span>
          <span className="meta-item">Submitted: {content?.submittedDate || 'Unknown Date'}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="review-section">
        <h4 className="section-title">Overall Rating</h4>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={`star-button ${star <= reviewData.rating ? 'filled' : ''}`}
              disabled={isSubmitting}
            >
              ★
            </button>
          ))}
          <span className="rating-text">
            {reviewData.rating === 0 ? 'Select rating' : `${reviewData.rating}/5 stars`}
          </span>
        </div>
      </div>

      {/* Strengths */}
      <div className="review-section">
        <h4 className="section-title">Strengths</h4>
        <div className="strengths-list">
          {reviewData.strengths.map((strength, index) => (
            <div key={index} className="strength-item">
              <input
                type="text"
                value={strength}
                onChange={(e) => handleStrengthChange(index, e.target.value)}
                placeholder={`Strength ${index + 1}`}
                className="strength-input"
                disabled={isSubmitting}
              />
              {reviewData.strengths.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStrength(index)}
                  className="remove-item-button"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStrength}
            className="add-item-button"
            disabled={isSubmitting}
          >
            + Add Strength
          </button>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="review-section">
        <h4 className="section-title">Areas for Improvement</h4>
        <div className="weaknesses-list">
          {reviewData.weaknesses.map((weakness, index) => (
            <div key={index} className="weakness-item">
              <input
                type="text"
                value={weakness}
                onChange={(e) => handleWeaknessChange(index, e.target.value)}
                placeholder={`Area for improvement ${index + 1}`}
                className="weakness-input"
                disabled={isSubmitting}
              />
              {reviewData.weaknesses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWeakness(index)}
                  className="remove-item-button"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addWeakness}
            className="add-item-button"
            disabled={isSubmitting}
          >
            + Add Area for Improvement
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="review-section">
        <h4 className="section-title">Comments for Author</h4>
        <textarea
          value={reviewData.comments}
          onChange={(e) => handleInputChange('comments', e.target.value)}
          placeholder="Provide constructive feedback for the author..."
          className="comments-textarea"
          rows={6}
          disabled={isSubmitting}
        />
        <div className="textarea-helper">
          These comments will be visible to the author
        </div>
      </div>

      {/* Private Notes */}
      <div className="review-section">
        <h4 className="section-title">Private Notes (Editor Only)</h4>
        <textarea
          value={reviewData.privateNotes}
          onChange={(e) => handleInputChange('privateNotes', e.target.value)}
          placeholder="Notes for editorial team only..."
          className="private-notes-textarea"
          rows={4}
          disabled={isSubmitting}
        />
        <div className="textarea-helper">
          These notes are only visible to editors
        </div>
      </div>

      {/* Recommendation */}
      <div className="review-section">
        <h4 className="section-title">Recommendation</h4>
        <select
          value={reviewData.recommendation}
          onChange={(e) => handleInputChange('recommendation', e.target.value)}
          className="recommendation-select"
          disabled={isSubmitting}
        >
          {recommendations.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Decision */}
      <div className="review-section decision-section">
        <h4 className="section-title">Final Decision</h4>
        <div className="decision-buttons">
          {canApprove && (
            <button
              type="button"
              className={`decision-button approve ${selectedStatus === REVIEW_STATUS.APPROVED ? 'selected' : ''}`}
              onClick={() => handleStatusChange(REVIEW_STATUS.APPROVED)}
              disabled={isSubmitting}
            >
              Approve
            </button>
          )}
          
          {canRequestRevision && (
            <button
              type="button"
              className={`decision-button revision ${selectedStatus === REVIEW_STATUS.REVISIONS_NEEDED ? 'selected' : ''}`}
              onClick={() => handleStatusChange(REVIEW_STATUS.REVISIONS_NEEDED)}
              disabled={isSubmitting}
            >
              Request Revisions
            </button>
          )}
          
          {canReject && (
            <button
              type="button"
              className={`decision-button reject ${selectedStatus === REVIEW_STATUS.REJECTED ? 'selected' : ''}`}
              onClick={() => handleStatusChange(REVIEW_STATUS.REJECTED)}
              disabled={isSubmitting}
            >
              Reject
            </button>
          )}
        </div>
        
        {selectedStatus && (
          <div className="status-message">
            Selected: <strong>{REVIEW_STATUS_DISPLAY[selectedStatus]}</strong>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="review-actions">
        <button
          type="button"
          onClick={handleSubmit}
          className="submit-review-button"
          disabled={!selectedStatus || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default ReviewPanel;
