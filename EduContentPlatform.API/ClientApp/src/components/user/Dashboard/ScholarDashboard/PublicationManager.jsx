import React, { useState } from 'react';
import {
  Search, Filter, MoreVertical, ExternalLink,
  Download, Eye, Edit, Trash2,
  FileText, BookOpen, Globe, Lock,
  TrendingUp, Users, Calendar, Award
} from 'lucide-react';

const PublicationManager = ({ publications = [], loading, fullView = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('list');
  const [selectedPublications, setSelectedPublications] = useState([]);

  const samplePublications = [
    {
      id: 1,
      title: 'Advancements in Quantum Computing Algorithms',
      type: 'journal',
      status: 'published',
      journal: 'Nature Physics',
      impactFactor: 4.8,
      citations: 124,
      downloads: 842,
      date: '2024-01-15',
      authors: ['John Doe', 'Jane Smith', 'Robert Johnson'],
      doi: '10.1038/nphys1234',
      abstract: 'This paper presents novel quantum computing algorithms...'
    },
    {
      id: 2,
      title: 'Machine Learning Applications in Medical Diagnosis',
      type: 'conference',
      status: 'published',
      conference: 'NeurIPS 2023',
      citations: 89,
      downloads: 521,
      date: '2023-12-10',
      authors: ['John Doe', 'Maria Garcia'],
      doi: '10.1109/neurips.2023.4567',
      abstract: 'Exploring deep learning techniques for medical imaging...'
    },
    {
      id: 3,
      title: 'Sustainable Energy Solutions for Urban Environments',
      type: 'journal',
      status: 'under_review',
      journal: 'Science Advances',
      impactFactor: 4.2,
      citations: 0,
      downloads: 45,
      date: '2024-01-20',
      authors: ['John Doe', 'Chen Wei', 'Anna Brown'],
      doi: 'pending',
      abstract: 'Analysis of renewable energy integration in cities...'
    },
    {
      id: 4,
      title: 'Blockchain Technology in Supply Chain Management',
      type: 'book_chapter',
      status: 'published',
      book: 'Advances in Business Technology',
      citations: 67,
      downloads: 312,
      date: '2023-11-05',
      authors: ['John Doe', 'David Wilson'],
      doi: '10.1007/978-3-031-45678-9_5',
      abstract: 'Case study on blockchain implementation...'
    },
    {
      id: 5,
      title: 'Climate Change Impact on Coastal Ecosystems',
      type: 'journal',
      status: 'draft',
      journal: 'Environmental Research Letters',
      impactFactor: 3.9,
      citations: 0,
      downloads: 12,
      date: '2024-01-25',
      authors: ['John Doe', 'Sarah Miller'],
      doi: 'pending',
      abstract: 'Long-term study of coastal biodiversity changes...'
    },
  ];

  const displayPublications = publications.length > 0 ? publications : samplePublications;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published', color: '#10b981' },
    { value: 'under_review', label: 'Under Review', color: '#f59e0b' },
    { value: 'draft', label: 'Draft', color: '#6b7280' },
    { value: 'accepted', label: 'Accepted', color: '#3b82f6' },
    { value: 'rejected', label: 'Rejected', color: '#ef4444' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'journal', label: 'Journal Article', icon: '📰' },
    { value: 'conference', label: 'Conference Paper', icon: '🎤' },
    { value: 'book_chapter', label: 'Book Chapter', icon: '📚' },
    { value: 'preprint', label: 'Preprint', icon: '📄' },
    { value: 'thesis', label: 'Thesis/Dissertation', icon: '🎓' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Publication Date' },
    { value: 'citations', label: 'Citations' },
    { value: 'title', label: 'Title' },
    { value: 'impact', label: 'Impact Factor' },
  ];

  const filteredPublications = displayPublications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || pub.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'date': return new Date(b.date) - new Date(a.date);
      case 'citations': return b.citations - a.citations;
      case 'title': return a.title.localeCompare(b.title);
      case 'impact': return (b.impactFactor || 0) - (a.impactFactor || 0);
      default: return 0;
    }
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'published': return <Globe size={14} />;
      case 'under_review': return <Eye size={14} />;
      case 'draft': return <Edit size={14} />;
      case 'accepted': return <Award size={14} />;
      default: return <Lock size={14} />;
    }
  };

  const getTypeIcon = (type) => {
    const option = typeOptions.find(opt => opt.value === type);
    return option?.icon || '📄';
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPublications(filteredPublications.map(pub => pub.id));
    } else {
      setSelectedPublications([]);
    }
  };

  const handleSelectPublication = (id) => {
    setSelectedPublications(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const exportPublications = (format) => {
    console.log(`Exporting publications in ${format} format...`);
    // Implement export functionality
  };

  const handleBulkAction = (action) => {
    console.log(`${action} selected publications:`, selectedPublications);
    // Implement bulk actions
  };

  if (loading) {
    return (
      <div className="publication-manager loading">
        <div className="loading-spinner"></div>
        <p>Loading publications...</p>
      </div>
    );
  }

  return (
    <div className="publication-manager">
      <div className="manager-header">
        <div className="header-left">
          <h3>
            <FileText size={24} />
            Publication Manager
          </h3>
          <span className="publication-count">
            {filteredPublications.length} publications
          </span>
        </div>
        <div className="header-actions">
          <div className="export-dropdown">
            <button className="btn-secondary">
              <Download size={18} />
              Export
            </button>
            <div className="export-options">
              <button onClick={() => exportPublications('bibtex')}>BibTeX</button>
              <button onClick={() => exportPublications('ris')}>RIS</button>
              <button onClick={() => exportPublications('csv')}>CSV</button>
              <button onClick={() => exportPublications('json')}>JSON</button>
            </div>
          </div>
          <button className="btn-primary">
            <FileText size={18} />
            Add New Publication
          </button>
        </div>
      </div>

      <div className="manager-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search publications by title, author, or abstract..."
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

      {selectedPublications.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <input
              type="checkbox"
              checked={selectedPublications.length === filteredPublications.length}
              onChange={handleSelectAll}
            />
            <span>{selectedPublications.length} publications selected</span>
          </div>
          <div className="bulk-buttons">
            <button className="btn-secondary" onClick={() => handleBulkAction('export')}>
              Export Selected
            </button>
            <button className="btn-secondary" onClick={() => handleBulkAction('update')}>
              Update Status
            </button>
            <button className="btn-danger" onClick={() => handleBulkAction('delete')}>
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="publication-grid-view">
          {filteredPublications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={48} />
              </div>
              <h4>No publications found</h4>
              <p>Try adjusting your filters or add new publications</p>
              <button className="btn-primary">
                <FileText size={18} />
                Add First Publication
              </button>
            </div>
          ) : (
            <div className="grid-container">
              {filteredPublications.map(pub => (
                <div key={pub.id} className="publication-card">
                  <div className="card-header">
                    <input
                      type="checkbox"
                      checked={selectedPublications.includes(pub.id)}
                      onChange={() => handleSelectPublication(pub.id)}
                      className="publication-checkbox"
                    />
                    <div className="publication-type">
                      <span className="type-icon">{getTypeIcon(pub.type)}</span>
                      <span className="type-label">{pub.type}</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h4>{pub.title}</h4>
                    
                    <div className="authors-list">
                      {pub.authors.slice(0, 3).map((author, idx) => (
                        <span key={idx} className="author">{author}</span>
                      ))}
                      {pub.authors.length > 3 && (
                        <span className="more-authors">+{pub.authors.length - 3} more</span>
                      )}
                    </div>
                    
                    <p className="publication-abstract">
                      {pub.abstract.substring(0, 150)}...
                    </p>
                    
                    <div className="publication-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{new Date(pub.date).toLocaleDateString()}</span>
                      </div>
                      {pub.journal && (
                        <div className="meta-item">
                          <BookOpen size={14} />
                          <span>{pub.journal}</span>
                        </div>
                      )}
                      {pub.conference && (
                        <div className="meta-item">
                          <Users size={14} />
                          <span>{pub.conference}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="publication-stats">
                      <div className="stat">
                        <TrendingUp size={14} />
                        <span>{pub.citations} citations</span>
                      </div>
                      <div className="stat">
                        <Download size={14} />
                        <span>{pub.downloads} downloads</span>
                      </div>
                      {pub.impactFactor && (
                        <div className="stat">
                          <Award size={14} />
                          <span>IF: {pub.impactFactor}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="publication-status">
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: statusOptions.find(s => s.value === pub.status)?.color || '#6b7280',
                          color: pub.status === 'published' ? 'white' : '#374151'
                        }}
                      >
                        {getStatusIcon(pub.status)}
                        {pub.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <a 
                      href={`https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-btn view"
                      title="View DOI"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button className="action-btn edit" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn download" title="Download">
                      <Download size={16} />
                    </button>
                    <button className="action-btn more" title="More options">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="publication-list-view">
          {filteredPublications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={48} />
              </div>
              <h4>No publications found</h4>
              <p>Try adjusting your filters or add new publications</p>
              <button className="btn-primary">
                <FileText size={18} />
                Add First Publication
              </button>
            </div>
          ) : (
            <div className="publication-table">
              <div className="table-header">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedPublications.length === filteredPublications.length}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="table-cell title">Title</div>
                <div className="table-cell authors">Authors</div>
                <div className="table-cell venue">Venue</div>
                <div className="table-cell date">Date</div>
                <div className="table-cell citations">Citations</div>
                <div className="table-cell status">Status</div>
                <div className="table-cell actions">Actions</div>
              </div>
              
              {filteredPublications.map(pub => (
                <div key={pub.id} className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPublications.includes(pub.id)}
                      onChange={() => handleSelectPublication(pub.id)}
                    />
                  </div>
                  <div className="table-cell title">
                    <div className="publication-title">
                      <span className="type-icon">{getTypeIcon(pub.type)}</span>
                      <div>
                        <h4>{pub.title}</h4>
                        <p className="publication-doi">DOI: {pub.doi}</p>
                      </div>
                    </div>
                  </div>
                  <div className="table-cell authors">
                    <div className="authors-display">
                      {pub.authors.slice(0, 2).map((author, idx) => (
                        <span key={idx} className="author">{author}</span>
                      ))}
                      {pub.authors.length > 2 && (
                        <span className="author-count">+{pub.authors.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <div className="table-cell venue">
                    {pub.journal || pub.conference || pub.book}
                  </div>
                  <div className="table-cell date">
                    {new Date(pub.date).toLocaleDateString()}
                  </div>
                  <div className="table-cell citations">
                    <div className="citation-count">
                      <TrendingUp size={14} />
                      {pub.citations}
                    </div>
                  </div>
                  <div className="table-cell status">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: statusOptions.find(s => s.value === pub.status)?.color || '#6b7280',
                        color: pub.status === 'published' ? 'white' : '#374151'
                      }}
                    >
                      {pub.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <a 
                        href={`https://doi.org/${pub.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-btn view"
                        title="View"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button className="action-btn edit" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn download" title="Download">
                        <Download size={16} />
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
        <div className="publication-summary">
          <div className="summary-card">
            <h4>Research Impact Summary</h4>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Total Citations</span>
                <span className="stat-value">
                  {displayPublications.reduce((sum, pub) => sum + pub.citations, 0)}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Avg. Impact Factor</span>
                <span className="stat-value">
                  {displayPublications.filter(p => p.impactFactor).length > 0 
                    ? (displayPublications
                        .filter(p => p.impactFactor)
                        .reduce((sum, pub) => sum + pub.impactFactor, 0) /
                       displayPublications.filter(p => p.impactFactor).length).toFixed(2)
                    : 'N/A'}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">H-Index</span>
                <span className="stat-value">
                  {calculateHIndex(displayPublications)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate H-Index
const calculateHIndex = (publications) => {
  const citations = publications
    .map(p => p.citations)
    .sort((a, b) => b - a);
  
  let h = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) {
      h = i + 1;
    } else {
      break;
    }
  }
  return h;
};

export default PublicationManager;