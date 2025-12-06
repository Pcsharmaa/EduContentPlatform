import React, { useState, useEffect } from 'react';
import { useEditorial } from '../../../hooks/useEditorial';
import { formatDate } from '../../../utils/formatDate';

const ContentQueue = () => {
  const [contentList, setContentList] = useState([]);
  const [filters, setFilters] = useState({
    contentType: 'all',
    dateRange: 'all',
    priority: 'all'
  });
  const [loading, setLoading] = useState(true);

  const { getContentQueue, assignToReviewer } = useEditorial();

  useEffect(() => {
    fetchContentQueue();
  }, [filters]);

  const fetchContentQueue = async () => {
    setLoading(true);
    try {
      const data = await getContentQueue(filters);
      setContentList(data);
    } catch (error) {
      console.error('Failed to fetch content queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (contentId, reviewerId) => {
    try {
      await assignToReviewer(contentId, reviewerId);
      fetchContentQueue(); // Refresh the list
    } catch (error) {
      console.error('Failed to assign reviewer:', error);
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'badge-danger',
      medium: 'badge-warning',
      low: 'badge-success'
    };
    return badges[priority] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading-spinner">Loading content queue...</div>;
  }

  return (
    <div className="content-queue">
      {/* Filters */}
      <div className="queue-filters">
        <select 
          value={filters.contentType}
          onChange={(e) => setFilters({...filters, contentType: e.target.value})}
        >
          <option value="all">All Content Types</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
          <option value="book">Books</option>
          <option value="article">Articles</option>
        </select>

        <select 
          value={filters.dateRange}
          onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select 
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <button onClick={fetchContentQueue} className="btn btn-sm">
          Apply Filters
        </button>
      </div>

      {/* Content Table */}
      <div className="queue-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Submitted By</th>
              <th>Date Submitted</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="content-title">
                    <strong>{item.title}</strong>
                    <small>{item.category}</small>
                  </div>
                </td>
                <td>
                  <span className={`content-type ${item.type}`}>
                    {item.type}
                  </span>
                </td>
                <td>{item.submittedBy}</td>
                <td>{formatDate(item.submittedDate)}</td>
                <td>
                  <span className={`badge ${getPriorityBadge(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td>
                  <span className={`status ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssign(item.id, 'reviewerId')}
                    >
                      Assign
                    </button>
                    <button className="btn btn-sm btn-secondary">
                      Preview
                    </button>
                    <button className="btn btn-sm btn-outline">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="btn btn-sm">Previous</button>
        <span>Page 1 of 5</span>
        <button className="btn btn-sm">Next</button>
      </div>
    </div>
  );
};

export default ContentQueue;