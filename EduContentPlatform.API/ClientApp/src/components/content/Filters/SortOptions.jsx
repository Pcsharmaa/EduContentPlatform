import React from 'react';
import './filters.css';

const SortOptions = ({ 
  options = [],
  selectedOption = '',
  onChange,
  label = 'Sort by:',
  showLabel = true,
}) => {
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (onChange) {
      onChange(value);
    }
  };

  const defaultOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'title_asc', label: 'Title: A-Z' },
    { value: 'title_desc', label: 'Title: Z-A' },
  ];

  const sortOptions = options.length > 0 ? options : defaultOptions;

  return (
    <div className="sort-options">
      {showLabel && (
        <span className="sort-label">{label}</span>
      )}
      
      <div className="sort-select-wrapper">
        <select
          value={selectedOption}
          onChange={handleSortChange}
          className="sort-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="select-arrow">▼</div>
      </div>

      {/* Quick Sort Buttons */}
      <div className="quick-sort-buttons">
        <button
          className={`quick-sort-button ${selectedOption === 'newest' ? 'active' : ''}`}
          onClick={() => onChange && onChange('newest')}
        >
          Newest
        </button>
        <button
          className={`quick-sort-button ${selectedOption === 'rating' ? 'active' : ''}`}
          onClick={() => onChange && onChange('rating')}
        >
          Top Rated
        </button>
        <button
          className={`quick-sort-button ${selectedOption === 'price_low' ? 'active' : ''}`}
          onClick={() => onChange && onChange('price_low')}
        >
          Price Low
        </button>
      </div>
    </div>
  );
};

export default SortOptions;