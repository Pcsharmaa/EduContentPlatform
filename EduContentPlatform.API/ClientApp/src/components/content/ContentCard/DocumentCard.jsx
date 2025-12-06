import React from 'react';
import { Link } from 'react-router-dom';

const DocumentCard = ({ document }) => {
  const {
    id,
    title,
    description,
    type,
    author,
    pages,
    fileSize,
    downloads,
    uploadDate,
    price,
    thumbnail,
  } = document;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      default:
        return '📁';
    }
  };

  return (
    <div className="document-card">
      <Link to={`/document/${id}`} className="document-card-link">
        <div className="document-card-header">
          <div className="document-icon">
            {getFileIcon(type)}
          </div>
          {thumbnail && (
            <img 
              src={thumbnail} 
              alt={title}
              className="document-thumbnail"
            />
          )}
        </div>
        
        <div className="document-card-body">
          <h3 className="document-card-title">
            {title}
          </h3>
          
          <p className="document-card-description">
            {description}
          </p>
          
          <div className="document-card-meta">
            <div className="document-card-author">
              By {author}
            </div>
            <div className="document-card-info">
              {pages} pages • {formatFileSize(fileSize)}
            </div>
          </div>
          
          <div className="document-card-footer">
            <div className="document-card-stats">
              <div className="document-downloads">
                {downloads.toLocaleString()} downloads
              </div>
              <div className="document-date">
                {new Date(uploadDate).toLocaleDateString()}
              </div>
            </div>
            <div className="document-card-price">
              {price === 0 ? 'Free' : `$${price}`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DocumentCard;