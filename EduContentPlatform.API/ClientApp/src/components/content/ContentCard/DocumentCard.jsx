import React from 'react';
import BaseCard from '../../content/ContentCard/BaseCard';

const DocumentCard = ({ document }) => {
  const {
    id,
    title,
    description,
    type = 'pdf',
    author,
    pages,
    fileSize,
    downloads = 0,
    uploadDate,
    price,
    thumbnail,
  } = document;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const typeMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
      txt: '📃',
      xls: '📈',
      xlsx: '📈',
    };
    return typeMap[fileType?.toLowerCase()] || '📁';
  };

  const displayDate = uploadDate ? new Date(uploadDate) : new Date();

  return (
    <BaseCard
      item={document}
      type="document"
      imageUrl={thumbnail || '/images/default-document.jpg'}
      imageAlt={title}
      title={title}
      subtitle={`By ${author}`}
      description={description}
      price={price}
      badge={<div className="file-type-badge">{getFileIcon(type)} {type?.toUpperCase()}</div>}
      metaInfo={
        <div className="document-meta">
          <span>{pages || 'N/A'} pages</span>
          <span className="meta-divider">•</span>
          <span>{formatFileSize(fileSize)}</span>
        </div>
      }
      footerLeft={
        <div className="document-stats">
          {downloads.toLocaleString()} downloads
        </div>
      }
      footerRight={
        <div className="document-date">
          {displayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      }
      linkTo={`/document/${id}`}
      hoverContent={
        <div className="document-hover-info">
          <div className="hover-detail-item">
            <span className="hover-label">File Type:</span>
            <span className="hover-value">{type?.toUpperCase()}</span>
          </div>
          <div className="hover-detail-item">
            <span className="hover-label">Size:</span>
            <span className="hover-value">{formatFileSize(fileSize)}</span>
          </div>
          <div className="hover-detail-item">
            <span className="hover-label">Uploaded:</span>
            <span className="hover-value">{displayDate.toLocaleDateString()}</span>
          </div>
        </div>
      }
    />
  );
};

export default DocumentCard;