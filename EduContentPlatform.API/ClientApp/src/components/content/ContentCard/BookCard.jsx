import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const {
    id,
    title,
    author,
    description,
    isbn,
    pages,
    publisher,
    publishDate,
    price,
    coverImage,
    rating,
    reviews,
    categories = [],
  } = book;

  return (
    <div className="book-card">
      <Link to={`/book/${id}`} className="book-card-link">
        <div className="book-card-cover">
          <img 
            src={coverImage || '/images/default-book-cover.jpg'} 
            alt={title}
            className="book-cover-image"
          />
        </div>
        
        <div className="book-card-body">
          <h3 className="book-card-title">
            {title}
          </h3>
          
          <div className="book-card-author">
            By {author}
          </div>
          
          <div className="book-card-categories">
            {categories.slice(0, 2).map((category, index) => (
              <span key={index} className="book-category">
                {category}
              </span>
            ))}
          </div>
          
          <p className="book-card-description">
            {description}
          </p>
          
          <div className="book-card-meta">
            <div className="book-card-pages">
              {pages} pages
            </div>
            <div className="book-card-publisher">
              {publisher}
            </div>
          </div>
          
          <div className="book-card-footer">
            <div className="book-card-rating">
              <div className="rating-stars">
                {'★'.repeat(Math.floor(rating))}
                {'☆'.repeat(5 - Math.floor(rating))}
              </div>
              <div className="rating-count">
                ({reviews} reviews)
              </div>
            </div>
            
            <div className="book-card-price">
              ${price}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;