import React from 'react';
import ContentCard from '../ContentCard/ContentCard';
import VideoCard from '../ContentCard/VideoCard';
import DocumentCard from '../ContentCard/DocumentCard';
import BookCard from '../ContentCard/BookCard';
import { CONTENT_TYPES } from '../../../constants/contentTypes';

const ContentGrid = ({ content = [], columns = 4 }) => {
  if (!content || content.length === 0) {
    return (
      <div className="content-grid-empty">
        <div className="empty-state-icon">📚</div>
        <h3 className="empty-state-title">No Content Available</h3>
        <p className="empty-state-message">
          There's no content to display at the moment.
        </p>
      </div>
    );
  }

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  const columnClass = gridColumns[columns] || gridColumns[4];

  const renderContentItem = (item, index) => {
    switch (item.type) {
      case CONTENT_TYPES.VIDEO:
        return <VideoCard key={item.id || index} video={item} />;
      case CONTENT_TYPES.DOCUMENT:
        return <DocumentCard key={item.id || index} document={item} />;
      case CONTENT_TYPES.BOOK:
        return <BookCard key={item.id || index} book={item} />;
      default:
        return <ContentCard key={item.id || index} content={item} />;
    }
  };

  return (
    <div className={`content-grid ${columnClass}`}>
      {content.map((item, index) => renderContentItem(item, index))}
    </div>
  );
};

export default ContentGrid;