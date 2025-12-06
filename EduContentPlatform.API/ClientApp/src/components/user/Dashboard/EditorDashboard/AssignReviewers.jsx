import React, { useState, useEffect } from 'react';
import { useEditorial } from '../../../hooks/useEditorial';
import ReviewerList from './ReviewerList';

const AssignReviewers = () => {
  const [availableContent, setAvailableContent] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const { getUnassignedContent, getAvailableReviewers, createAssignment } = useEditorial();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentData, reviewerData] = await Promise.all([
        getUnassignedContent(),
        getAvailableReviewers()
      ]);
      setAvailableContent(contentData);
      setReviewers(reviewerData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content);
  };

  const handleReviewerToggle = (reviewerId) => {
    setSelectedReviewers(prev => {
      if (prev.includes(reviewerId)) {
        return prev.filter(id => id !== reviewerId);
      }
      return [...prev, reviewerId];
    });
  };

  const handleAssign = async () => {
    if (!selectedContent || selectedReviewers.length === 0) {
      alert('Please select content and at least one reviewer');
      return;
    }

    try {
      await createAssignment({
        contentId: selectedContent.id,
        reviewerIds: selectedReviewers,
        notes: assignmentNotes,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
      
      // Reset form
      setSelectedContent(null);
      setSelectedReviewers([]);
      setAssignmentNotes('');
      
      // Refresh data
      fetchData();
      
      alert('Reviewers assigned successfully!');
    } catch (error) {
      console.error('Failed to assign reviewers:', error);
      alert('Failed to assign reviewers');
    }
  };

  return (
    <div className="assign-reviewers">
      <div className="assign-header">
        <h2>Assign Reviewers</h2>
        <p>Assign available reviewers to content awaiting review</p>
      </div>

      <div className="assign-container">
        {/* Left Panel - Available Content */}
        <div className="content-panel">
          <h3>Available Content</h3>
          <div className="content-list">
            {availableContent.map(content => (
              <div 
                key={content.id}
                className={`content-item ${selectedContent?.id === content.id ? 'selected' : ''}`}
                onClick={() => handleContentSelect(content)}
              >
                <div className="content-info">
                  <h4>{content.title}</h4>
                  <div className="content-meta">
                    <span className="content-type">{content.type}</span>
                    <span className="content-category">{content.category}</span>
                    <span className="content-date">{content.submittedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Panel - Selected Content Details */}
        <div className="details-panel">
          <h3>Selected Content Details</h3>
          {selectedContent ? (
            <div className="selected-content">
              <h4>{selectedContent.title}</h4>
              <p>{selectedContent.description}</p>
              
              <div className="content-details">
                <div className="detail-item">
                  <strong>Author:</strong> {selectedContent.author}
                </div>
                <div className="detail-item">
                  <strong>Category:</strong> {selectedContent.category}
                </div>
                <div className="detail-item">
                  <strong>Submitted:</strong> {selectedContent.submittedDate}
                </div>
                <div className="detail-item">
                  <strong>Estimated Review Time:</strong> {selectedContent.estimatedTime}
                </div>
              </div>

              <div className="assignment-notes">
                <label>Assignment Notes</label>
                <textarea 
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Add specific instructions for reviewers..."
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select content from the left panel to assign reviewers</p>
            </div>
          )}
        </div>

        {/* Right Panel - Available Reviewers */}
        <div className="reviewers-panel">
          <h3>Available Reviewers</h3>
          <div className="reviewers-list">
            {reviewers.map(reviewer => (
              <div 
                key={reviewer.id}
                className={`reviewer-item ${selectedReviewers.includes(reviewer.id) ? 'selected' : ''}`}
                onClick={() => handleReviewerToggle(reviewer.id)}
              >
                <div className="reviewer-info">
                  <h4>{reviewer.name}</h4>
                  <p className="reviewer-expertise">{reviewer.expertise.join(', ')}</p>
                  <div className="reviewer-stats">
                    <span>Assigned: {reviewer.currentAssignments}</span>
                    <span>Completed: {reviewer.completedReviews}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="assign-actions">
            <button 
              className="btn btn-primary"
              onClick={handleAssign}
              disabled={!selectedContent || selectedReviewers.length === 0}
            >
              Assign Selected Reviewers ({selectedReviewers.length})
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setSelectedContent(null);
                setSelectedReviewers([]);
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignReviewers;