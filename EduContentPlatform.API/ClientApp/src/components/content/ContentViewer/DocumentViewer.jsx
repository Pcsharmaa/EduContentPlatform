import React, { useState } from 'react';

const DocumentViewer = ({ 
  fileUrl, 
  fileType, 
  title,
  onError 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (error) => {
    setError(error.message);
    setLoading(false);
    if (onError) onError(error);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="document-error">
          <div className="error-icon">❌</div>
          <h3>Unable to load document</h3>
          <p>{error}</p>
          <a 
            href={fileUrl} 
            download={title}
            className="download-button"
          >
            Download Document
          </a>
        </div>
      );
    }

    switch (fileType) {
      case 'pdf':
        return (
          <iframe
            src={`${fileUrl}#view=FitH`}
            title={title}
            className="document-iframe"
            onLoad={handleLoad}
            onError={handleError}
          />
        );
      
      case 'doc':
      case 'docx':
        return (
          <div className="document-preview">
            <div className="document-message">
              <div className="document-icon">📝</div>
              <h3>Word Document</h3>
              <p>Preview not available for Word documents</p>
              <a 
                href={fileUrl} 
                download={title}
                className="download-button"
              >
                Download Document
              </a>
            </div>
          </div>
        );
      
      case 'txt':
      case 'rtf':
        return (
          <div className="text-document">
            <pre className="text-content">
              Loading text content...
            </pre>
          </div>
        );
      
      default:
        return (
          <div className="document-preview">
            <div className="document-message">
              <div className="document-icon">📁</div>
              <h3>Document Preview</h3>
              <p>Preview not available for this file type</p>
              <a 
                href={fileUrl} 
                download={title}
                className="download-button"
              >
                Download File
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="document-viewer">
      <div className="document-viewer-header">
        <h3 className="document-title">{title}</h3>
        <div className="document-actions">
          <a 
            href={fileUrl} 
            download={title}
            className="action-button"
          >
            Download
          </a>
          <button className="action-button">
            Print
          </button>
        </div>
      </div>
      
      <div className="document-viewer-content">
        {loading && (
          <div className="document-loading">
            <div className="loading-spinner"></div>
            <p>Loading document...</p>
          </div>
        )}
        
        {renderContent()}
      </div>
      
      <div className="document-viewer-footer">
        <div className="document-info">
          <span className="file-type">{fileType.toUpperCase()}</span>
          <span className="file-size">• Click Download to save</span>
        </div>
        
        <div className="document-navigation">
          <button 
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="nav-button"
          >
            Previous
          </button>
          <span className="page-info">Page {page}</span>
          <button 
            onClick={() => setPage(prev => prev + 1)}
            className="nav-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;