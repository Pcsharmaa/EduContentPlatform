import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const {
    id,
    title,
    description,
    duration,
    thumbnail,
    author,
    views,
    uploadDate,
    price,
  } = video;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-card">
      <Link to={`/video/${id}`} className="video-card-link">
        <div className="video-card-thumbnail">
          <img 
            src={thumbnail || '/images/default-video-thumbnail.jpg'} 
            alt={title}
            className="thumbnail-image"
          />
          <div className="video-duration">
            {formatDuration(duration)}
          </div>
          <div className="video-play-button">
            ▶
          </div>
        </div>
        
        <div className="video-card-body">
          <h3 className="video-card-title">
            {title}
          </h3>
          
          <p className="video-card-description">
            {description}
          </p>
          
          <div className="video-card-meta">
            <div className="video-card-author">
              By {author}
            </div>
            <div className="video-card-views">
              {views.toLocaleString()} views
            </div>
          </div>
          
          <div className="video-card-footer">
            <div className="video-card-date">
              Uploaded {new Date(uploadDate).toLocaleDateString()}
            </div>
            <div className="video-card-price">
              {price === 0 ? 'Free' : `$${price}`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;