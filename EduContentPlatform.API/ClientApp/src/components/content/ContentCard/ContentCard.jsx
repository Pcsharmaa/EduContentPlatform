import React from 'react';
import BaseCard from '../../content/ContentCard/BaseCard';
import { CONTENT_TYPE_DISPLAY_NAMES } from '../../../constants/contentTypes';

const ContentCard = ({ content }) => {
  const {
    id,
    title,
    description,
    type,
    category,
    author,
    price,
    rating,
    thumbnail,
    students = 0,
    createdAt,
  } = content;

  const displayDate = createdAt ? new Date(createdAt) : new Date();

  return (
    <BaseCard
      item={content}
      type="content"
      imageUrl={thumbnail || '/images/default-thumbnail.jpg'}
      imageAlt={title}
      title={title}
      subtitle={`By ${author}`}
      description={description}
      price={price}
      badge={
        <div className="content-type-badge">
          {CONTENT_TYPE_DISPLAY_NAMES[type] || type}
        </div>
      }
      metaInfo={
        <div className="content-meta">
          <span className="content-category">{category}</span>
        </div>
      }
      footerLeft={
        <div className="content-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(rating || 0))}
            {'☆'.repeat(5 - Math.floor(rating || 0))}
          </span>
          <span className="student-count">({students} students)</span>
        </div>
      }
      footerRight={
        <div className="content-date">
          {displayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      }
      linkTo={`/content/${id}`}
      hoverContent={
        <div className="content-hover-info">
          <div className="hover-detail-item">
            <span className="hover-label">Category:</span>
            <span className="hover-value">{category}</span>
          </div>
          <div className="hover-detail-item">
            <span className="hover-label">Type:</span>
            <span className="hover-value">{CONTENT_TYPE_DISPLAY_NAMES[type] || type}</span>
          </div>
          <div className="hover-detail-item">
            <span className="hover-label">Created:</span>
            <span className="hover-value">{displayDate.toLocaleDateString()}</span>
          </div>
        </div>
      }
    />
  );
};

export default ContentCard;