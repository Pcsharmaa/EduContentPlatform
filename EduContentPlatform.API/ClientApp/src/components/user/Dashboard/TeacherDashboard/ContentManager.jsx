import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Edit, 
  Trash2, Eye, Upload, Download, 
  CheckCircle, Clock, AlertCircle, Globe, Lock
} from 'lucide-react';
import './TeacherDashboard.css';

const ContentManager = ({ content = [], loading, fullView = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedContent, setSelectedContent] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const sampleContent = [
    {
      id: 1,
      title: 'Advanced Calculus',
      type: 'course',
      status: 'published',
      views: 1240,
      rating: 4.8,
      students: 156,
      revenue: 1240,
      createdAt: '2024-01-10',
      thumbnail: '/images/calculus.jpg',
      description: 'Comprehensive calculus course covering limits, derivatives, and integrals.'
    },
    {
      id: 2,
      title: 'Physics 101',
      type: 'course',
      status: 'published',
      views: 980,
      rating: 4.7,
      students: 124,
      revenue: 980,
      createdAt: '2024-01-05',
      thumbnail: '/images/physics.jpg',
      description: 'Introduction to physics concepts and principles.'
    },
    {
      id: 3,
      title: 'Chemistry Basics',
      type: 'course',
      status: 'draft',
      views: 450,
      rating: 4.6,
      students: 89,
      revenue: 450,
      createdAt: '2024-01-15',
      thumbnail: '/images/chemistry.jpg',
      description: 'Fundamental chemistry concepts for beginners.'
    },
    {
      id: 4,
      title: 'Python Programming',
      type: 'course',
      status: 'published',
      views: 2100,
      rating: 4.9,
      students: 245,
      revenue: 2100,
      createdAt: '2023-12-20',
      thumbnail: '/images/python.jpg',
      description: 'Learn Python programming from scratch.'
    },
    {
      id: 5,
      title: 'Data Structures',
      type: 'course',
      status: 'review',
      views: 320,
      rating: 4.5,
      students: 67,
      revenue: 320,
      createdAt: '2024-01-18',
      thumbnail: '/images/datastructures.jpg',
      description: 'Understanding data structures and algorithms.'
    },
  ];

  const displayContent = content.length > 0 ? content : sampleContent;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published', color: '#10b981' },
    { value: 'draft', label: 'Draft', color: '#6b7280' },
    { value: 'review', label: 'In Review', color: '#f59e0b' },
    { value: 'archived', label: 'Archived', color: '#9ca3af' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'views', label: 'Views' },
    { value: 'rating', label: 'Rating' },
    { value: 'revenue', label: 'Revenue' },
  ];

  const filteredContent = displayContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'date': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'title': return a.title.localeCompare(b.title);
      case 'views': return b.views - a.views;
      case 'rating': return b.rating - a.rating;
      case 'revenue': return b.revenue - a.revenue;
      default: return 0;
    }
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'published': return <CheckCircle size={14} />;
      case 'draft': return <Edit size={14} />;
      case 'review': return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || '#6b7280';
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContent(filteredContent.map(item => item.id));
    } else {
      setSelectedContent([]);
    }
  };

  const handleSelectContent = (id) => {
    setSelectedContent(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`${action} selected content:`, selectedContent);
    // Implement bulk actions
  };

  const exportContent = () => {
    // Implement export functionality
    console.log('Exporting content...');
  };

  if (loading) {
    return (
      <div className="content-manager loading">
        <div className="loading-spinner"></div>
        <p>Loading your content...</p>
      </div>
    );
  }

  return (
    <div className="content-manager">
      <div className="manager-header">
        <div className="header-left">
          <h3>Content Manager</h3>
          <span className="content-count">{filteredContent.length} items</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportContent}>
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary">
            <Upload size={18} />
            Upload New
          </button>
        </div>
      </div>

      <div className="manager-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search content by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="controls-right">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedContent.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <input
              type="checkbox"
              checked={selectedContent.length === filteredContent.length}
              onChange={handleSelectAll}
            />
            <span>{selectedContent.length} items selected</span>
          </div>
          <div className="bulk-buttons">
            <button className="btn-secondary" onClick={() => handleBulkAction('publish')}>
              Publish
            </button>
            <button className="btn-secondary" onClick={() => handleBulkAction('archive')}>
              Archive
            </button>
            <button className="btn-danger" onClick={() => handleBulkAction('delete')}>
              Delete
            </button>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="content-grid-view">
          {filteredContent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={48} />
              </div>
              <h4>No content found</h4>
              <p>Try adjusting your filters or create new content</p>
              <button className="btn-primary">
                <Upload size={18} />
                Create First Content
              </button>
            </div>
          ) : (
            <div className="grid-container">
              {filteredContent.map(item => (
                <div key={item.id} className="content-card">
                  <div className="card-header">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => handleSelectContent(item.id)}
                      className="content-checkbox"
                    />
                    <div className="card-visibility">
                      {item.status === 'published' ? <Globe size={14} /> : <Lock size={14} />}
                    </div>
                  </div>
                  
                  <div className="card-thumbnail">
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="card-type">{item.type}</div>
                  </div>
                  
                  <div className="card-content">
                    <h4>{item.title}</h4>
                    <p className="card-description">{item.description}</p>
                    
                    <div className="card-stats">
                      <div className="stat">
                        <Eye size={14} />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <Star size={14} />
                        <span>{item.rating}</span>
                      </div>
                      <div className="stat">
                        <Users size={14} />
                        <span>{item.students}</span>
                      </div>
                    </div>
                    
                    <div className="card-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      >
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="action-btn view" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="action-btn edit" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn analytics" title="Analytics">
                      <BarChart3 size={16} />
                    </button>
                    <button className="action-btn more" title="More">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="content-list-view">
          {filteredContent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={48} />
              </div>
              <h4>No content found</h4>
              <p>Try adjusting your filters or create new content</p>
              <button className="btn-primary">
                <Upload size={18} />
                Create First Content
              </button>
            </div>
          ) : (
            <div className="content-table">
              <div className="table-header">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedContent.length === filteredContent.length}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="table-cell title">Title</div>
                <div className="table-cell status">Status</div>
                <div className="table-cell views">Views</div>
                <div className="table-cell rating">Rating</div>
                <div className="table-cell students">Students</div>
                <div className="table-cell revenue">Revenue</div>
                <div className="table-cell actions">Actions</div>
              </div>
              
              {filteredContent.map(item => (
                <div key={item.id} className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => handleSelectContent(item.id)}
                    />
                  </div>
                  <div className="table-cell title">
                    <div className="content-title">
                      <img src={item.thumbnail} alt={item.title} className="content-thumb" />
                      <div>
                        <h4>{item.title}</h4>
                        <p className="content-desc">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="table-cell status">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(item.status),
                        color: item.status === 'published' ? 'white' : '#374151'
                      }}
                    >
                      {getStatusIcon(item.status)}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <div className="table-cell views">{item.views.toLocaleString()}</div>
                  <div className="table-cell rating">
                    <div className="rating-display">
                      <span className="rating-stars">
                        {"★".repeat(Math.floor(item.rating))}
                        {"☆".repeat(5 - Math.floor(item.rating))}
                      </span>
                      <span className="rating-value">{item.rating}</span>
                    </div>
                  </div>
                  <div className="table-cell students">{item.students}</div>
                  <div className="table-cell revenue">${item.revenue}</div>
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <button className="action-btn view" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn edit" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!fullView && (
        <div className="content-summary">
          <div className="summary-card">
            <h4>Performance Summary</h4>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">
                  ${displayContent.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Avg. Rating</span>
                <span className="stat-value">
                  {(displayContent.reduce((sum, item) => sum + item.rating, 0) / displayContent.length).toFixed(1)}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">
                  {displayContent.reduce((sum, item) => sum + item.students, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;