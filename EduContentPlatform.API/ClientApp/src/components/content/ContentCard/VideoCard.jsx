import React from 'react';
import BaseCard from '../../content/ContentCard/BaseCard';

const VideoCard = ({ video }) => {
  const {
    id,
    title,
    description,
    duration,
    thumbnail,
    author,
    views = 0,
    uploadDate,
    price,
  } = video;

  const formatDuration = (duration) => {
    if (typeof duration === 'string') {
      if (duration.includes(':')) return duration;
      const num = parseInt(duration);
      if (!isNaN(num)) {
        const hours = Math.floor(num / 3600);
        const minutes = Math.floor((num % 3600) / 60);
        const seconds = num % 60;
        
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return duration;
    }
    
    const seconds = parseInt(duration) || 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const displayDate = uploadDate ? new Date(uploadDate) : new Date();

  return (
    <BaseCard
      item={video}
      type="video"
      imageUrl={thumbnail || '/images/default-video-thumbnail.jpg'}
      imageAlt={title}
      title={title}
      subtitle={`By ${author}`}
      description={description}
      price={price}
      badge={<div className="duration-badge">{formatDuration(duration)}</div>}
      footerLeft={
        <div className="video-stats">
          {views.toLocaleString()} views
        </div>
      }
      footerRight={
        <div className="video-date">
          {displayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      }
      linkTo={`/video/${id}`}
      hoverContent={
        <div className="video-hover-play">
          <div className="play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      }
    />
  );
};

export default VideoCard;