import React, { useState } from 'react';
import { dateUtils } from '../../../services/utils/formatDate';
import './review.css';

const RevisionNotes = ({ 
  notes = [],
  onSubmitNote,
  onCompleteRevision,
  onRequestExtension,
  isSubmitting = false,
  canSubmitNote = true,
  canComplete = false,
  canRequestExtension = false,
  dueDate,
}) => {
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('comment');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmitNote = () => {
    if (newNote.trim() && onSubmitNote) {
      onSubmitNote({
        text: newNote.trim(),
        type: noteType,
        isUrgent,
        timestamp: new Date().toISOString(),
      });
      setNewNote('');
      setIsUrgent(false);
    }
  };

  const handleCompleteRevision = () => {
    if (onCompleteRevision) {
      onCompleteRevision();
    }
  };

  const handleRequestExtension = () => {
    if (onRequestExtension) {
      onRequestExtension();
    }
  };

  const noteTypes = [
    { value: 'comment', label: 'Comment', icon: '💬' },
    { value: 'question', label: 'Question', icon: '❓' },
    { value: 'clarification', label: 'Clarification', icon: '🔍' },
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'issue', label: 'Issue', icon: '⚠️' },
  ];

  const filteredNotes = notes.filter(note => 
    note.type === 'comment' || note.type === 'question' || note.type === 'clarification'
  );

  const suggestions = notes.filter(note => note.type === 'suggestion');
  const issues = notes.filter(note => note.type === 'issue');

  return (
    <div className="revision-notes">
      {/* Header */}
      <div className="revision-header">
        <h3 className="revision-title">Revision Notes</h3>
        {dueDate && (
          <div className="revision-due-date">
            Due: {dateUtils.formatDate(dueDate, 'PPP')}
            <span className={`due-status ${new Date(dueDate) < new Date() ? 'overdue' : 'ontime'}`}>
              {new Date(dueDate) < new Date() ? 'Overdue' : 'On Time'}
            </span>
          </div>
        )}
      </div>

      {/* Add Note */}
      {canSubmitNote && (
        <div className="add-note-section">
          <div className="note-type-selector">
            {noteTypes.map(type => (
              <button
                key={type.value}
                type="button"
                className={`type-button ${noteType === type.value ? 'selected' : ''}`}
                onClick={() => setNoteType(type.value)}
                disabled={isSubmitting}
              >
                <span className="type-icon">{type.icon}</span>
                <span className="type-label">{type.label}</span>
              </button>
            ))}
          </div>

          <div className="note-input-container">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Add a ${noteType}...`}
              className="note-textarea"
              rows={4}
              disabled={isSubmitting}
            />
            
            <div className="note-options">
              <label className="urgent-checkbox">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="checkbox-label">Mark as urgent</span>
              </label>

              <button
                onClick={handleSubmitNote}
                className="submit-note-button"
                disabled={!newNote.trim() || isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Summary */}
      <div className="notes-summary">
        <div className="summary-item">
          <span className="summary-count">{filteredNotes.length}</span>
          <span className="summary-label">Notes & Questions</span>
        </div>
        <div className="summary-item">
          <span className="summary-count">{suggestions.length}</span>
          <span className="summary-label">Suggestions</span>
        </div>
        <div className="summary-item">
          <span className="summary-count">{issues.length}</span>
          <span className="summary-label">Issues</span>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-sections">
        {/* Notes & Questions */}
        {filteredNotes.length > 0 && (
          <div className="notes-section">
            <h4 className="section-title">Notes & Questions</h4>
            <div className="notes-list">
              {filteredNotes.map((note, index) => (
                <div 
                  key={index} 
                  className={`note-item ${note.type} ${note.isUrgent ? 'urgent' : ''}`}
                >
                  <div className="note-header">
                    <span className="note-type">
                      {noteTypes.find(t => t.value === note.type)?.icon}
                      {note.isUrgent && <span className="urgent-badge">URGENT</span>}
                    </span>
                    <span className="note-time">
                      {dateUtils.formatForDisplay(note.timestamp)}
                    </span>
                  </div>
                  <div className="note-content">{note.text}</div>
                  {note.response && (
                    <div className="note-response">
                      <div className="response-label">Response:</div>
                      <div className="response-content">{note.response}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="notes-section">
            <h4 className="section-title">Suggestions</h4>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <div className="suggestion-icon">💡</div>
                  <div className="suggestion-content">
                    {suggestion.text}
                    {suggestion.implemented && (
                      <span className="implemented-badge">Implemented</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {issues.length > 0 && (
          <div className="notes-section">
            <h4 className="section-title">Issues to Address</h4>
            <div className="issues-list">
              {issues.map((issue, index) => (
                <div key={index} className="issue-item">
                  <div className="issue-icon">⚠️</div>
                  <div className="issue-content">
                    <div className="issue-text">{issue.text}</div>
                    <div className="issue-status">
                      Status: <span className={`status ${issue.resolved ? 'resolved' : 'pending'}`}>
                        {issue.resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="revision-actions">
        {canRequestExtension && (
          <button
            onClick={handleRequestExtension}
            className="action-button request-extension"
            disabled={isSubmitting}
          >
            Request Extension
          </button>
        )}
        
        {canComplete && (
          <button
            onClick={handleCompleteRevision}
            className="action-button complete-revision"
            disabled={isSubmitting}
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default RevisionNotes;