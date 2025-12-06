import React, { useState } from 'react';
import { dateUtils } from '../../../services/utils/formatDate';
import './review.css';

const ReviewComments = ({ 
  comments = [],
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  canAddComment = true,
  canEditComment = () => true,
  canDeleteComment = () => true,
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleEditComment = (comment) => {
    if (editText.trim() && onEditComment) {
      onEditComment(comment.id, editText.trim());
      setEditingCommentId(null);
      setEditText('');
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onDeleteComment) {
        onDeleteComment(commentId);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="review-comments">
      <h3 className="comments-title">Comments ({comments.length})</h3>

      {/* Add Comment */}
      {canAddComment && (
        <div className="add-comment-section">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            className="comment-textarea"
            rows={3}
          />
          <div className="comment-actions">
            <button
              onClick={handleAddComment}
              className="add-comment-button"
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
            <div className="comment-help">
              Press Enter to submit, Shift+Enter for new line
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <p className="no-comments-text">No comments yet</p>
            <p className="no-comments-subtext">Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`comment-item ${comment.userId === currentUserId ? 'own-comment' : ''}`}
            >
              {/* Comment Header */}
              <div className="comment-header">
                <div className="comment-author">
                  <div className="author-avatar">
                    {comment.userName?.charAt(0) || 'U'}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{comment.userName}</div>
                    <div className="author-role">{comment.userRole}</div>
                  </div>
                </div>
                
                <div className="comment-meta">
                  <span className="comment-time">
                    {dateUtils.formatForDisplay(comment.createdAt)}
                  </span>
                  
                  {comment.editedAt && (
                    <span className="comment-edited">
                      (edited)
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              {editingCommentId === comment.id ? (
                <div className="comment-edit">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-textarea"
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleEditComment(comment)}
                      className="save-edit-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="cancel-edit-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-content">
                    {comment.text}
                  </div>
                  
                  {/* Comment Actions */}
                  <div className="comment-actions">
                    <button className="reply-button">
                      Reply
                    </button>
                    
                    {comment.userId === currentUserId && canEditComment(comment) && (
                      <button
                        onClick={() => startEdit(comment)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                    )}
                    
                    {canDeleteComment(comment) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply-item">
                      <div className="reply-header">
                        <div className="reply-author">
                          <div className="reply-avatar">
                            {reply.userName?.charAt(0)}
                          </div>
                          <span className="reply-name">{reply.userName}</span>
                        </div>
                        <span className="reply-time">
                          {dateUtils.formatForDisplay(reply.createdAt)}
                        </span>
                      </div>
                      <div className="reply-content">{reply.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewComments;