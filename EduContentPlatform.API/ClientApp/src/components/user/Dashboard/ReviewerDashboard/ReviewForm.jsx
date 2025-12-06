import React, { useState, useEffect } from 'react';
import { useReview } from '../../../hooks/useReview';
import ReviewRubric from './ReviewRubric';
import './reviewForm.css';

const ReviewForm = () => {
  const [reviewData, setReviewData] = useState(null);
  const [formData, setFormData] = useState({
    recommendation: '',
    summary: '',
    majorComments: '',
    minorComments: '',
    confidentialComments: '',
    scores: {}
  });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState([]);

  const { getActiveReview, submitReview, saveDraft } = useReview();

  useEffect(() => {
    loadActiveReview();
  }, []);

  const loadActiveReview = async () => {
    try {
      const data = await getActiveReview();
      setReviewData(data);
      if (data.draft) {
        setFormData(data.draft);
      }
    } catch (error) {
      console.error('Failed to load active review:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScoreChange = (criterion, score) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [criterion]: score
      }
    }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveDraft(reviewData.id, formData);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!validateForm()) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    if (!window.confirm('Are you sure you want to submit this review? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      await submitReview(reviewData.id, formData);
      alert('Review submitted successfully!');
      // Navigate to history or queue
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    const { recommendation, summary, scores } = formData;
    
    if (!recommendation) return false;
    if (!summary || summary.trim().length < 50) return false;
    
    // Check if all required scores are provided
    const requiredCriteria = reviewData?.rubric?.criteria || [];
    const allScored = requiredCriteria.every(criterion => 
      scores[criterion.id] !== undefined && scores[criterion.id] !== null
    );
    
    return allScored;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="review-step">
            <h3>Content Evaluation</h3>
            {reviewData?.rubric && (
              <ReviewRubric 
                rubric={reviewData.rubric}
                scores={formData.scores}
                onScoreChange={handleScoreChange}
              />
            )}
          </div>
        );
      case 2:
        return (
          <div className="review-step">
            <h3>Review Comments</h3>
            <div className="comment-section">
              <div className="form-group">
                <label>Executive Summary *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Provide a brief summary of your review..."
                  rows={4}
                  required
                />
                <small>Provide an overall assessment of the content</small>
              </div>
              
              <div className="form-group">
                <label>Major Comments</label>
                <textarea
                  value={formData.majorComments}
                  onChange={(e) => handleInputChange('majorComments', e.target.value)}
                  placeholder="List major issues or strengths..."
                  rows={6}
                />
                <small>Significant issues that need to be addressed</small>
              </div>
              
              <div className="form-group">
                <label>Minor Comments</label>
                <textarea
                  value={formData.minorComments}
                  onChange={(e) => handleInputChange('minorComments', e.target.value)}
                  placeholder="List minor suggestions or corrections..."
                  rows={4}
                />
                <small>Suggestions for improvement (optional)</small>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="review-step">
            <h3>Recommendation & Confidential Comments</h3>
            <div className="recommendation-section">
              <div className="form-group">
                <label>Your Recommendation *</label>
                <div className="recommendation-options">
                  {['Accept', 'Minor Revision', 'Major Revision', 'Reject'].map(option => (
                    <label key={option} className="radio-option">
                      <input
                        type="radio"
                        name="recommendation"
                        value={option}
                        checked={formData.recommendation === option}
                        onChange={(e) => handleInputChange('recommendation', e.target.value)}
                        required
                      />
                      <span className="radio-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Confidential Comments to Editor</label>
                <textarea
                  value={formData.confidentialComments}
                  onChange={(e) => handleInputChange('confidentialComments', e.target.value)}
                  placeholder="Comments that only the editor will see..."
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Attachments (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setAttachments(prev => [...prev, ...files]);
                    }}
                  />
                  <div className="upload-hint">
                    <i className="icon-upload"></i>
                    <span>Click to upload supporting documents</span>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div className="attachment-list">
                    {attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <i className="icon-file"></i>
                        <span>{file.name}</span>
                        <button 
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          className="btn-remove"
                        >
                          <i className="icon-close"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!reviewData) {
    return (
      <div className="no-active-review">
        <i className="icon-search"></i>
        <h3>No active review found</h3>
        <p>Please select a review from your queue to begin.</p>
        <button className="btn btn-primary">
          Go to Review Queue
        </button>
      </div>
    );
  }

  return (
    <div className="review-form">
      {/* Form Header */}
      <div className="form-header">
        <div className="header-info">
          <h2>Review Form</h2>
          <div className="review-info">
            <span className="content-title">{reviewData.title}</span>
            <span className="content-author">by {reviewData.author}</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="deadline-display">
            <i className="icon-clock"></i>
            <span>Deadline: {reviewData.deadline}</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3].map(step => (
          <div 
            key={step} 
            className={`step ${step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}`}
            onClick={() => setCurrentStep(step)}
          >
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 ? 'Evaluation' : step === 2 ? 'Comments' : 'Recommendation'}
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-content">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="form-navigation">
        <div className="nav-left">
          <button 
            className="btn btn-secondary"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            <i className="icon-save"></i>
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
        
        <div className="nav-right">
          {currentStep > 1 && (
            <button 
              className="btn btn-outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <i className="icon-arrow-left"></i> Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next <i className="icon-arrow-right"></i>
            </button>
          ) : (
            <button 
              className="btn btn-success"
              onClick={handleSubmitReview}
              disabled={saving || !validateForm()}
            >
              <i className="icon-send"></i>
              {saving ? 'Submitting...' : 'Submit Review'}
            </button>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="preview-panel">
        <h4>Review Preview</h4>
        <div className="preview-content">
          <div className="preview-section">
            <strong>Overall Assessment:</strong>
            <p>{formData.summary || 'Not provided'}</p>
          </div>
          {formData.recommendation && (
            <div className="preview-section">
              <strong>Recommendation:</strong>
              <span className={`recommendation-badge ${formData.recommendation.toLowerCase().replace(' ', '-')}`}>
                {formData.recommendation}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;