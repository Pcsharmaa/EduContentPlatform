import React from 'react';
import { Link } from 'react-router-dom';
import  '../../content/ContentCard/Cards.css';

const BaseCard = ({ 
  item, 
  type = 'content',
  imageUrl, 
  imageAlt,
  title,
  subtitle,
  description,
  price,
  metaInfo,
  footerLeft,
  footerRight,
  badge,
  hoverContent,
  linkTo
}) => {
  return (
    <div className={`card card-${type}`}>
      <Link to={linkTo || '#'} className="card-link">
        {/* IMAGE/CONTAINER SECTION */}
        <div className="card-image-container">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={imageAlt || title}
              className="card-image"
              loading="lazy"
            />
          )}
          {badge && <div className="card-badge">{badge}</div>}
        </div>

        {/* BODY SECTION */}
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
          {description && (
            <p className="card-description">{description}</p>
          )}
          {metaInfo && (
            <div className="card-meta">{metaInfo}</div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div className="card-footer">
          <div className="card-footer-left">
            {footerLeft}
          </div>
          <div className="card-footer-right">
            {price !== undefined && (
              <span className="card-price">
                {price === 0 ? 'Free' : `$${typeof price === 'number' ? price.toFixed(2) : price}`}
              </span>
            )}
            {footerRight}
          </div>
        </div>

        {/* HOVER OVERLAY */}
        {hoverContent && (
          <div className="card-hover-overlay">
            {hoverContent}
          </div>
        )}
      </Link>
    </div>
  );
};

export default BaseCard;