import React, { useState } from 'react';
import {
  Search, Database, Calculator, BarChart3,
  FileText, Download, Upload, Share2,
  Link, BookOpen, Users, Globe,
  TrendingUp, Target, Calendar, Zap,
  Filter, SortAsc, Plus, ExternalLink
} from 'lucide-react';

const ResearchTools = ({ detailed = false }) => {
  const [activeTool, setActiveTool] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState([]);

  const researchTools = [
    {
      id: 1,
      name: 'Statistical Analysis Suite',
      category: 'analysis',
      description: 'Advanced statistical tools for data analysis and hypothesis testing',
      icon: <Calculator size={24} />,
      access: 'premium',
      rating: 4.8,
      users: 1250,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Literature Review Assistant',
      category: 'literature',
      description: 'AI-powered tool for systematic literature reviews and citation management',
      icon: <BookOpen size={24} />,
      access: 'free',
      rating: 4.6,
      users: 890,
      color: 'green'
    },
    {
      id: 3,
      name: 'Data Visualization Studio',
      category: 'visualization',
      description: 'Create publication-quality graphs and charts from research data',
      icon: <BarChart3 size={24} />,
      access: 'premium',
      rating: 4.9,
      users: 2100,
      color: 'purple'
    },
    {
      id: 4,
      name: 'Collaboration Platform',
      category: 'collaboration',
      description: 'Real-time collaboration tools for research teams',
      icon: <Users size={24} />,
      access: 'free',
      rating: 4.7,
      users: 3400,
      color: 'orange'
    },
    {
      id: 5,
      name: 'Grant Proposal Manager',
      category: 'grants',
      description: 'Tools for writing, formatting, and managing grant proposals',
      icon: <FileText size={24} />,
      access: 'premium',
      rating: 4.5,
      users: 780,
      color: 'teal'
    },
    {
      id: 6,
      name: 'Research Data Repository',
      category: 'data',
      description: 'Secure storage and sharing platform for research datasets',
      icon: <Database size={24} />,
      access: 'free',
      rating: 4.8,
      users: 4500,
      color: 'indigo'
    },
  ];

  const researchDatasets = [
    {
      id: 1,
      name: 'Climate Change Indicators 2023',
      size: '2.4 GB',
      format: 'CSV',
      downloads: 1240,
      license: 'CC BY 4.0',
      updated: '2024-01-15',
      description: 'Global climate indicators including temperature, precipitation, and sea level data'
    },
    {
      id: 2,
      name: 'Genomic Sequencing Database',
      size: '15.8 GB',
      format: 'FASTA',
      downloads: 890,
      license: 'Open Access',
      updated: '2023-12-10',
      description: 'Complete genomic sequences for various species'
    },
    {
      id: 3,
      name: 'Economic Indicators Dataset',
      size: '850 MB',
      format: 'Excel',
      downloads: 2100,
      license: 'CC BY-NC 4.0',
      updated: '2024-01-05',
      description: 'Global economic indicators from 2000-2023'
    },
    {
      id: 4,
      name: 'Social Media Sentiment Analysis',
      size: '3.2 GB',
      format: 'JSON',
      downloads: 1560,
      license: 'Research Only',
      updated: '2023-11-30',
      description: 'Anonymized social media posts with sentiment labels'
    },
  ];

  const upcomingWebinars = [
    {
      title: 'Advanced Data Analysis Techniques',
      date: '2024-02-20',
      time: '2:00 PM EST',
      speaker: 'Dr. Sarah Chen',
      category: 'analysis'
    },
    {
      title: 'Writing Effective Research Proposals',
      date: '2024-02-25',
      time: '11:00 AM EST',
      speaker: 'Prof. James Wilson',
      category: 'grants'
    },
    {
      title: 'Visualizing Complex Data',
      date: '2024-03-05',
      time: '3:00 PM EST',
      speaker: 'Dr. Maria Rodriguez',
      category: 'visualization'
    },
  ];

  const toolCategories = [
    { id: 'all', label: 'All Tools' },
    { id: 'analysis', label: 'Data Analysis' },
    { id: 'literature', label: 'Literature Review' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'grants', label: 'Grant Writing' },
    { id: 'data', label: 'Data Management' },
  ];

  const filteredTools = researchTools.filter(tool => {
    const matchesCategory = activeTool === 'all' || tool.category === activeTool;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDatasetSelect = (id) => {
    setSelectedDatasets(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDownloadSelected = () => {
    console.log('Downloading selected datasets:', selectedDatasets);
    // Implement download functionality
  };

  const handleShareDataset = (dataset) => {
    console.log('Sharing dataset:', dataset);
    // Implement sharing functionality
  };

  const registerForWebinar = (webinar) => {
    console.log('Registering for webinar:', webinar);
    // Implement registration functionality
  };

  return (
    <div className="research-tools">
      <div className="tools-header">
        <div className="header-left">
          <h3>
            <Zap size={24} />
            Research Tools & Resources
          </h3>
          <p>Access specialized tools and datasets to enhance your research workflow</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <Plus size={18} />
            Request New Tool
          </button>
          <button className="btn-secondary">
            <Upload size={18} />
            Upload Dataset
          </button>
        </div>
      </div>

      <div className="tools-categories">
        <div className="category-tabs">
          {toolCategories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeTool === category.id ? 'active' : ''}`}
              onClick={() => setActiveTool(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search for research tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="tools-grid">
        {filteredTools.map(tool => (
          <div key={tool.id} className={`tool-card ${tool.color}`}>
            <div className="tool-header">
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-access">
                <span className={`access-badge ${tool.access}`}>
                  {tool.access}
                </span>
              </div>
            </div>
            
            <div className="tool-content">
              <h4>{tool.name}</h4>
              <p className="tool-description">{tool.description}</p>
              
              <div className="tool-stats">
                <div className="stat">
                  <Star size={14} />
                  <span>{tool.rating}</span>
                </div>
                <div className="stat">
                  <Users size={14} />
                  <span>{tool.users.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="tool-actions">
              <button className="btn-tool">
                <ExternalLink size={16} />
                Open Tool
              </button>
              <button className="btn-tool-secondary">
                <BookOpen size={16} />
                Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailed && (
        <>
          <div className="datasets-section">
            <div className="section-header">
              <h4>
                <Database size={20} />
                Research Datasets
              </h4>
              {selectedDatasets.length > 0 && (
                <button 
                  className="btn-primary"
                  onClick={handleDownloadSelected}
                >
                  <Download size={16} />
                  Download Selected ({selectedDatasets.length})
                </button>
              )}
            </div>

            <div className="datasets-table">
              <div className="table-header">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDatasets.length === researchDatasets.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDatasets(researchDatasets.map(d => d.id));
                      } else {
                        setSelectedDatasets([]);
                      }
                    }}
                  />
                </div>
                <div className="table-cell name">Dataset Name</div>
                <div className="table-cell size">Size</div>
                <div className="table-cell format">Format</div>
                <div className="table-cell downloads">Downloads</div>
                <div className="table-cell license">License</div>
                <div className="table-cell updated">Updated</div>
                <div className="table-cell actions">Actions</div>
              </div>
              
              {researchDatasets.map(dataset => (
                <div key={dataset.id} className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.includes(dataset.id)}
                      onChange={() => handleDatasetSelect(dataset.id)}
                    />
                  </div>
                  <div className="table-cell name">
                    <div className="dataset-info">
                      <h5>{dataset.name}</h5>
                      <p className="dataset-description">{dataset.description}</p>
                    </div>
                  </div>
                  <div className="table-cell size">{dataset.size}</div>
                  <div className="table-cell format">{dataset.format}</div>
                  <div className="table-cell downloads">
                    <div className="download-count">
                      <Download size={14} />
                      {dataset.downloads}
                    </div>
                  </div>
                  <div className="table-cell license">
                    <span className="license-badge">{dataset.license}</span>
                  </div>
                  <div className="table-cell updated">
                    {new Date(dataset.updated).toLocaleDateString()}
                  </div>
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <button 
                        className="action-btn download"
                        onClick={() => handleDatasetSelect(dataset.id)}
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        className="action-btn preview"
                        onClick={() => console.log('Preview:', dataset)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn share"
                        onClick={() => handleShareDataset(dataset)}
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="webinars-section">
            <div className="section-header">
              <h4>
                <Calendar size={20} />
                Upcoming Research Webinars
              </h4>
              <button className="view-all">View Calendar →</button>
            </div>

            <div className="webinars-grid">
              {upcomingWebinars.map((webinar, index) => (
                <div key={index} className="webinar-card">
                  <div className="webinar-header">
                    <div className="webinar-category">{webinar.category}</div>
                    <div className="webinar-date">
                      <Calendar size={14} />
                      {new Date(webinar.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="webinar-content">
                    <h5>{webinar.title}</h5>
                    <div className="webinar-details">
                      <div className="detail">
                        <Clock size={14} />
                        <span>{webinar.time}</span>
                      </div>
                      <div className="detail">
                        <Users size={14} />
                        <span>Speaker: {webinar.speaker}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="webinar-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => registerForWebinar(webinar)}
                    >
                      Register Now
                    </button>
                    <button className="btn-outline">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="research-resources">
        <h4>Additional Resources</h4>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="resource-icon">
              <Link size={24} />
            </div>
            <div className="resource-content">
              <h5>API Access</h5>
              <p>Connect to our research tools via API</p>
              <button className="resource-link">Get API Key →</button>
            </div>
          </div>
          
          <div className="resource-card">
            <div className="resource-icon">
              <Globe size={24} />
            </div>
            <div className="resource-content">
              <h5>Community Forums</h5>
              <p>Connect with fellow researchers</p>
              <button className="resource-link">Join Discussion →</button>
            </div>
          </div>
          
          <div className="resource-card">
            <div className="resource-icon">
              <FileText size={24} />
            </div>
            <div className="resource-content">
              <h5>Documentation</h5>
              <p>Complete guides and tutorials</p>
              <button className="resource-link">Browse Docs →</button>
            </div>
          </div>
          
          <div className="resource-card">
            <div className="resource-icon">
              <Target size={24} />
            </div>
            <div className="resource-content">
              <h5>Research Templates</h5>
              <p>Ready-to-use templates</p>
              <button className="resource-link">Download →</button>
            </div>
          </div>
        </div>
      </div>

      <div className="tools-newsletter">
        <div className="newsletter-content">
          <h5>Stay Updated</h5>
          <p>Subscribe to receive updates about new tools and features</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchTools;