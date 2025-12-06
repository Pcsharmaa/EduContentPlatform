import React, { useState, useEffect } from 'react';
import { debounce } from '../../../services/utils/helpers';
import './filters.css';

const SearchFilters = ({ 
  onSearch,
  placeholder = 'Search...',
  debounceDelay = 300,
  initialValue = '',
  showAdvanced = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    type: '',
    category: '',
    author: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    dateRange: '',
  });

  // Create debounced search function
  const debouncedSearch = debounce((term, filters) => {
    if (onSearch) {
      onSearch(term, filters);
    }
  }, debounceDelay);

  useEffect(() => {
    debouncedSearch(searchTerm, advancedOpen ? advancedFilters : {});
  }, [searchTerm, advancedFilters, advancedOpen]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAdvancedFilters({
      type: '',
      category: '',
      author: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      dateRange: '',
    });
  };

  const contentTypes = [
    { value: '', label: 'All Types' },
    { value: 'course', label: 'Courses' },
    { value: 'publication', label: 'Publications' },
    { value: 'book', label: 'Books' },
    { value: 'video', label: 'Videos' },
    { value: 'document', label: 'Documents' },
    { value: 'article', label: 'Articles' },
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business' },
    { value: 'history', label: 'History' },
    { value: 'literature', label: 'Literature' },
  ];

  const dateRanges = [
    { value: '', label: 'Any Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const ratings = [
    { value: '', label: 'Any Rating' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3', label: '3+ Stars' },
  ];

  return (
    <div className="search-filters">
      {/* Main Search */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="search-input"
          />
          <button className="search-button">
            🔍
          </button>
        </div>
        
        {showAdvanced && (
          <button
            className={`advanced-toggle ${advancedOpen ? 'active' : ''}`}
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            Advanced Filters {advancedOpen ? '▲' : '▼'}
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && advancedOpen && (
        <div className="advanced-filters">
          <div className="filters-grid">
            {/* Content Type */}
            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select
                value={advancedFilters.type}
                onChange={(e) => handleAdvancedFilterChange('type', e.target.value)}
                className="filter-select"
              >
                {contentTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={advancedFilters.category}
                onChange={(e) => handleAdvancedFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {categories.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="filter-group">
              <label className="filter-label">Author</label>
              <input
                type="text"
                value={advancedFilters.author}
                onChange={(e) => handleAdvancedFilterChange('author', e.target.value)}
                placeholder="Search by author"
                className="filter-input"
              />
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  value={advancedFilters.minPrice}
                  onChange={(e) => handleAdvancedFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="price-input"
                  min="0"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  value={advancedFilters.maxPrice}
                  onChange={(e) => handleAdvancedFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="price-input"
                  min="0"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <select
                value={advancedFilters.minRating}
                onChange={(e) => handleAdvancedFilterChange('minRating', e.target.value)}
                className="filter-select"
              >
                {ratings.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="filter-group">
              <label className="filter-label">Date Range</label>
              <select
                value={advancedFilters.dateRange}
                onChange={(e) => handleAdvancedFilterChange('dateRange', e.target.value)}
                className="filter-select"
              >
                {dateRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <button
              onClick={clearFilters}
              className="clear-filters-button"
            >
              Clear All Filters
            </button>
            <div className="active-filters-count">
              {Object.values(advancedFilters).filter(v => v !== '').length} active filters
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;