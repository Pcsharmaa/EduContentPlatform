import React from 'react';
import { Link } from 'react-router-dom';
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
    students,
    createdAt,
  } = content;

  return (
    <div className="content-card">
      <Link to={`/content/${id}`} className="content-card-link">
        <div className="content-card-image">
          <img 
            src={thumbnail || '/images/default-thumbnail.jpg'} 
            alt={title}
            className="content-card-thumbnail"
          />
          <div className="content-card-type-badge">
            {CONTENT_TYPE_DISPLAY_NAMES[type] || type}
          </div>
        </div>
        
        <div className="content-card-body">
          <div className="content-card-category">
            {category}
          </div>
          
          <h3 className="content-card-title">
            {title}
          </h3>
          
          <p className="content-card-description">
            {description}
          </p>
          
          <div className="content-card-author">
            By {author}
          </div>
          
          <div className="content-card-footer">
            <div className="content-card-rating">
              <span className="rating-stars">★★★★★</span>
              <span className="rating-value">{rating}</span>
            </div>
            
            <div className="content-card-price">
              {price === 0 ? 'Free' : `$${price}`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContentCard;