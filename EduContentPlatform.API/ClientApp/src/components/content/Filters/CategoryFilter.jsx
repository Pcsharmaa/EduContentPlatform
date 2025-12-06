import React, { useState } from 'react';
import './filters.css';

const CategoryFilter = ({ 
  categories = [],
  selectedCategories = [],
  onChange,
  maxVisible = 5,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const visibleCategories = showAll 
    ? categories.filter(cat => 
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories.slice(0, maxVisible);

  const handleCategoryToggle = (category) => {
    let newSelected;
    
    if (selectedCategories.includes(category)) {
      newSelected = selectedCategories.filter(cat => cat !== category);
    } else {
      newSelected = [...selectedCategories, category];
    }
    
    if (onChange) {
      onChange(newSelected);
    }
  };

  const handleSelectAll = () => {
    if (onChange) {
      onChange([...categories]);
    }
  };

  const handleClearAll = () => {
    if (onChange) {
      onChange([]);
    }
  };

  return (
    <div className="category-filter">
      <div className="filter-header">
        <h3 className="filter-title">Categories</h3>
        
        <div className="filter-actions">
          <button
            onClick={handleSelectAll}
            className="filter-action-button"
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            className="filter-action-button"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search for categories */}
      {categories.length > maxVisible && (
        <div className="category-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="search-input"
          />
        </div>
      )}

      {/* Categories List */}
      <div className="categories-list">
        {visibleCategories.map((category) => (
          <label
            key={category}
            className={`category-item ${selectedCategories.includes(category) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              className="category-checkbox"
            />
            <span className="category-name">{category}</span>
            <span className="category-count">
              {/* You can add count data here if available */}
            </span>
          </label>
        ))}
      </div>

      {/* Show More/Less */}
      {categories.length > maxVisible && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="show-more-button"
        >
          {showAll ? 'Show Less' : `Show All (${categories.length})`}
        </button>
      )}

      {/* Selected Categories Summary */}
      {selectedCategories.length > 0 && (
        <div className="selected-summary">
          <div className="summary-header">
            <span className="summary-count">
              {selectedCategories.length} selected
            </span>
            <button
              onClick={handleClearAll}
              className="clear-selected-button"
            >
              Clear
            </button>
          </div>
          
          <div className="selected-tags">
            {selectedCategories.map(category => (
              <span key={category} className="selected-tag">
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;