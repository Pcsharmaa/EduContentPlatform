import React, { useState } from 'react';
import { Bookmark, BookOpen, Clock, Tag, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      title: 'Introduction to Quantum Mechanics',
      type: 'video',
      duration: '45 min',
      progress: 65,
      tags: ['Physics', 'Advanced'],
      date: '2024-01-15',
      thumbnail: '/images/quantum.jpg'
    },
    {
      id: 2,
      title: 'Linear Algebra Textbook',
      type: 'book',
      pages: 320,
      progress: 42,
      tags: ['Math', 'Algebra'],
      date: '2024-01-10',
      thumbnail: '/images/algebra.jpg'
    },
    {
      id: 3,
      title: 'Python Programming Exercises',
      type: 'document',
      pages: 45,
      progress: 90,
      tags: ['Programming', 'Python'],
      date: '2024-01-05',
      thumbnail: '/images/python.jpg'
    },
    {
      id: 4,
      title: 'Organic Chemistry Lab Guide',
      type: 'document',
      pages: 28,
      progress: 30,
      tags: ['Chemistry', 'Lab'],
      date: '2024-01-03',
      thumbnail: '/images/chemistry.jpg'
    },
    {
      id: 5,
      title: 'Data Structures Explained',
      type: 'video',
      duration: '1.5 hours',
      progress: 55,
      tags: ['CS', 'Algorithms'],
      date: '2023-12-28',
      thumbnail: '/images/datastructures.jpg'
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const handleRemoveBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      setBookmarks([]);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (filter === 'all') return true;
    return bookmark.type === filter;
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch(sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'progress':
        return b.progress - a.progress;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return '🎬';
      case 'book': return '📚';
      case 'document': return '📄';
      default: return '📎';
    }
  };

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <div className="header-left">
          <h3>
            <Bookmark size={20} />
            My Bookmarks
          </h3>
          <span className="count-badge">{bookmarks.length} items</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-clear"
            onClick={handleClearAll}
            disabled={bookmarks.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bookmarks-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'video' ? 'active' : ''}`}
            onClick={() => setFilter('video')}
          >
            Videos
          </button>
          <button 
            className={`filter-btn ${filter === 'book' ? 'active' : ''}`}
            onClick={() => setFilter('book')}
          >
            Books
          </button>
          <button 
            className={`filter-btn ${filter === 'document' ? 'active' : ''}`}
            onClick={() => setFilter('document')}
          >
            Documents
          </button>
        </div>

        <div className="sort-dropdown">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="progress">Progress</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {sortedBookmarks.length === 0 ? (
        <div className="empty-bookmarks">
          <Bookmark size={48} />
          <p>No bookmarks yet</p>
          <small>Save content to access it quickly later</small>
        </div>
      ) : (
        <div className="bookmarks-list">
          {sortedBookmarks.map(bookmark => (
            <div key={bookmark.id} className="bookmark-item">
              <div className="bookmark-content">
                <div className="bookmark-thumbnail">
                  <div className="thumbnail-icon">
                    {getTypeIcon(bookmark.type)}
                  </div>
                  <div className="progress-ring">
                    <svg width="40" height="40">
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="3"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="none"
                        stroke="#4361ee"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${bookmark.progress * 1.13} 113`}
                        transform="rotate(-90 20 20)"
                      />
                    </svg>
                    <span className="progress-text">{bookmark.progress}%</span>
                  </div>
                </div>
                
                <div className="bookmark-details">
                  <h4>{bookmark.title}</h4>
                  <div className="bookmark-meta">
                    <span className="meta-item">
                      {bookmark.type === 'video' ? (
                        <>
                          <Clock size={14} />
                          {bookmark.duration}
                        </>
                      ) : (
                        <>
                          <BookOpen size={14} />
                          {bookmark.pages} pages
                        </>
                      )}
                    </span>
                    <span className="meta-date">
                      Added {new Date(bookmark.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bookmark-tags">
                    {bookmark.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bookmark-actions">
                <button className="action-btn open" title="Open">
                  <ExternalLink size={16} />
                </button>
                <button 
                  className="action-btn remove" 
                  title="Remove"
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                >
                  <Trash2 size={16} />
                </button>
                <button className="action-btn more" title="More options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bookmarks-stats">
        <div className="stat-item">
          <span className="stat-label">Total Bookmarks:</span>
          <span className="stat-value">{bookmarks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg. Progress:</span>
          <span className="stat-value">
            {bookmarks.length > 0 
              ? Math.round(bookmarks.reduce((sum, b) => sum + b.progress, 0) / bookmarks.length)
              : 0}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Most Viewed:</span>
          <span className="stat-value">Videos</span>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;