import React, { useState, useEffect } from 'react';
import './reviewerList.css';

const ReviewerList = ({ reviewers, onSelectReviewer, selectedReviewers = [], isMultiSelect = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReviewers, setFilteredReviewers] = useState(reviewers);
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Extract unique expertise areas
  const expertiseAreas = React.useMemo(() => {
    const areas = new Set();
    reviewers.forEach(reviewer => {
      reviewer.expertise?.forEach(area => areas.add(area));
    });
    return ['all', ...Array.from(areas)];
  }, [reviewers]);

  useEffect(() => {
    let filtered = reviewers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(reviewer =>
        reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reviewer.expertise?.some(exp => 
          exp.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply expertise filter
    if (expertiseFilter !== 'all') {
      filtered = filtered.filter(reviewer =>
        reviewer.expertise?.includes(expertiseFilter)
      );
    }

    // Apply availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(reviewer => {
        if (availabilityFilter === 'available') return reviewer.available;
        if (availabilityFilter === 'busy') return !reviewer.available;
        return true;
      });
    }

    setFilteredReviewers(filtered);
  }, [reviewers, searchTerm, expertiseFilter, availabilityFilter]);

  const handleReviewerClick = (reviewer) => {
    if (onSelectReviewer) {
      onSelectReviewer(reviewer);
    }
  };

  const isSelected = (reviewerId) => {
    if (Array.isArray(selectedReviewers)) {
      return selectedReviewers.includes(reviewerId);
    }
    return selectedReviewers === reviewerId;
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 80) return 'workload-high';
    if (workload >= 50) return 'workload-medium';
    return 'workload-low';
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="rating-stars">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
        <span className="rating-number">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="reviewer-list">
      {/* Filters */}
      <div className="reviewer-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reviewers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="icon-search"></i>
        </div>

        <div className="filter-controls">
          <select 
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            className="filter-select"
          >
            {expertiseAreas.map(area => (
              <option key={area} value={area}>
                {area === 'all' ? 'All Expertise' : area}
              </option>
            ))}
          </select>

          <select 
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="reviewer-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredReviewers.length}</span>
          <span className="stat-label">Reviewers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {filteredReviewers.filter(r => r.available).length}
          </span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {filteredReviewers.reduce((sum, r) => sum + (r.averageRating || 0), 0) / filteredReviewers.length || 0}
          </span>
          <span className="stat-label">Avg Rating</span>
        </div>
      </div>

      {/* Reviewer Grid */}
      <div className="reviewer-grid">
        {filteredReviewers.length === 0 ? (
          <div className="no-reviewers">
            <i className="icon-users"></i>
            <h3>No reviewers found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredReviewers.map(reviewer => (
            <div 
              key={reviewer.id}
              className={`reviewer-card ${isSelected(reviewer.id) ? 'selected' : ''} ${reviewer.available ? 'available' : 'busy'}`}
              onClick={() => handleReviewerClick(reviewer)}
            >
              {/* Selection Indicator */}
              {isMultiSelect && (
                <div className="selection-indicator">
                  <input
                    type="checkbox"
                    checked={isSelected(reviewer.id)}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
              )}

              {/* Reviewer Header */}
              <div className="reviewer-header">
                <div className="reviewer-avatar">
                  {reviewer.avatar ? (
                    <img src={reviewer.avatar} alt={reviewer.name} />
                  ) : (
                    <span className="avatar-placeholder">
                      {reviewer.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {reviewer.available && (
                    <span className="availability-dot"></span>
                  )}
                </div>
                
                <div className="reviewer-info">
                  <h3 className="reviewer-name">{reviewer.name}</h3>
                  <p className="reviewer-email">{reviewer.email}</p>
                  <p className="reviewer-institution">{reviewer.institution}</p>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="expertise-tags">
                {reviewer.expertise?.slice(0, 3).map((expertise, index) => (
                  <span key={index} className="expertise-tag">
                    {expertise}
                  </span>
                ))}
                {reviewer.expertise?.length > 3 && (
                  <span className="more-tags">+{reviewer.expertise.length - 3} more</span>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="performance-metrics">
                <div className="metric">
                  <div className="metric-label">Rating</div>
                  <div className="metric-value">
                    {getRatingStars(reviewer.averageRating || 0)}
                  </div>
                </div>
                
                <div className="metric">
                  <div className="metric-label">Workload</div>
                  <div className="metric-value">
                    <div className="workload-bar">
                      <div 
                        className={`workload-fill ${getWorkloadColor(reviewer.workload || 0)}`}
                        style={{ width: `${reviewer.workload || 0}%` }}
                      ></div>
                    </div>
                    <span className="workload-text">{reviewer.workload || 0}%</span>
                  </div>
                </div>
                
                <div className="metric">
                  <div className="metric-label">Avg Time</div>
                  <div className="metric-value">
                    {reviewer.averageReviewTime || 'N/A'} days
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="reviewer-stats">
                <div className="stat">
                  <div className="stat-number">{reviewer.completedReviews || 0}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{reviewer.currentAssignments || 0}</div>
                  <div className="stat-label">Active</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{reviewer.rejectionRate || 0}%</div>
                  <div className="stat-label">Rejection</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="reviewer-actions">
                {reviewer.available ? (
                  <button className="btn btn-sm btn-primary">
                    <i className="icon-message"></i> Contact
                  </button>
                ) : (
                  <button className="btn btn-sm btn-outline" disabled>
                    <i className="icon-clock"></i> Busy
                  </button>
                )}
                
                <button className="btn btn-sm btn-outline">
                  <i className="icon-eye"></i> Profile
                </button>
              </div>

              {/* Additional Info */}
              <div className="additional-info">
                {reviewer.specializations && (
                  <div className="info-item">
                    <strong>Specializations:</strong> {reviewer.specializations.join(', ')}
                  </div>
                )}
                
                {reviewer.lastActive && (
                  <div className="info-item">
                    <strong>Last Active:</strong> {reviewer.lastActive}
                  </div>
                )}
                
                {reviewer.preferences && (
                  <div className="info-item">
                    <strong>Prefers:</strong> {reviewer.preferences.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk Actions (for multi-select mode) */}
      {isMultiSelect && selectedReviewers.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            {selectedReviewers.length} reviewer(s) selected
          </div>
          <div className="action-buttons">
            <button className="btn btn-primary">
              <i className="icon-send"></i> Assign Selected
            </button>
            <button className="btn btn-outline">
              <i className="icon-download"></i> Export List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerList;