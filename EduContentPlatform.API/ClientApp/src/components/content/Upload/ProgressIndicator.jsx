import React from 'react';

const ProgressIndicator = ({ 
  progress = 0, 
  status = 'uploading',
  message = '',
  showPercentage = true,
  showStatus = true,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return '#3b82f6';
      case 'processing':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'paused':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return '⬆️';
      case 'processing':
        return '⚙️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'paused':
        return '⏸️';
      default:
        return '⬆️';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Complete!';
      case 'error':
        return 'Upload Failed';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  };

  return (
    <div className="progress-indicator">
      <div className="progress-header">
        {showStatus && (
          <div className="status-info">
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-text">{getStatusText()}</span>
          </div>
        )}
        
        {showPercentage && (
          <div className="progress-percentage">
            {Math.round(progress)}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{ 
            width: `${progress}%`,
            backgroundColor: getStatusColor(),
          }}
        />
      </div>

      {/* Message */}
      {message && (
        <div className="progress-message">
          {message}
        </div>
      )}

      {/* Details */}
      <div className="progress-details">
        {status === 'uploading' && progress < 100 && (
          <div className="upload-details">
            <span className="detail-item">Uploading...</span>
            <span className="detail-item">Please don't close this window</span>
          </div>
        )}
        
        {status === 'error' && (
          <div className="error-details">
            <span className="detail-item error">Upload failed. Please try again.</span>
          </div>
        )}
        
        {status === 'success' && (
          <div className="success-details">
            <span className="detail-item success">Upload completed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;