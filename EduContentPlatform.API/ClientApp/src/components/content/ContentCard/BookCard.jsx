import React from 'react';
import BaseCard from '../../content/ContentCard/BaseCard';

const BookCard = ({ book }) => {
  const {
    id,
    title,
    author,
    description,
    pages,
    publisher,
    publishDate,
    price,
    coverImage,
    rating = 0,
    reviews = 0,
  } = book;

  const displayDate = publishDate ? new Date(publishDate) : new Date();
  
  // Calculate star rating
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <BaseCard
      item={book}
      type="book"
      imageUrl={coverImage || '/images/default-book-cover.jpg'}
      imageAlt={title}
      title={title}
      subtitle={`By ${author}`}
      description={description}
      price={price}
      metaInfo={
        <div className="book-meta">
          <span>{pages} pages</span>
          <span className="meta-divider">•</span>
          <span>{publisher}</span>
        </div>
      }
      footerLeft={
        <div className="book-rating">
          <span className="stars">
            {'★'.repeat(fullStars)}
            {'☆'.repeat(emptyStars)}
          </span>
          <span className="review-count">({reviews})</span>
        </div>
      }
      linkTo={`/book/${id}`}
      hoverContent={
        <div className="book-hover-details">
          <div className="hover-detail-item">
            <span className="hover-label">Published:</span>
            <span className="hover-value">{displayDate.toLocaleDateString()}</span>
          </div>
          <div className="hover-detail-item">
            <span className="hover-label">Pages:</span>
            <span className="hover-value">{pages}</span>
          </div>
          <div className="hover-detail-item">
            <span className="hover-label">Publisher:</span>
            <span className="hover-value">{publisher}</span>
          </div>
          <div className="hover-price-display">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </div>
        </div>
      }
    />
  );
};

export default BookCard;