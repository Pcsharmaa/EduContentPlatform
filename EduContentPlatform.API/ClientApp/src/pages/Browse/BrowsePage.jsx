import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import ContentGrid from '../../components/content/ContentGrid/ContentGrid';
import Button from '../../components/common/UI/Button/Button';
import { contentService } from '../../services/api/content';
import './browse.css';

const BrowsePage = () => {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'all',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Medicine',
    'Business',
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, selectedCategory, searchQuery]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      const data = await contentService.getFeatured();
      // Duplicate to simulate more content
      setContent([...data, ...data, ...data]);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContent(filtered);
  };

  return (
    <MainLayout>
      <div className="browse-page">
        {/* Header */}
        <section className="browse-header">
          <div className="header-content">
            <h1>Browse Educational Content</h1>
            <p>Discover thousands of courses, publications, and educational resources</p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filter">
            <h3>Categories</h3>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="content-section">
          <div className="results-header">
            <h2>
              {selectedCategory === 'all'
                ? 'All Content'
                : `${selectedCategory} Content`}
            </h2>
            <p className="results-count">
              {filteredContent.length} results found
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading content...</p>
            </div>
          ) : filteredContent.length > 0 ? (
            <ContentGrid content={filteredContent} columns={4} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Content Found</h3>
              <p>
                {searchQuery
                  ? 'No content matches your search. Try different keywords.'
                  : 'No content available in this category.'}
              </p>
              {searchQuery && (
                <Button
                  variant="primary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default BrowsePage;
