import React, { useState, useRef } from 'react';
import { cloudStorageService } from '../../../services/storage/cloudStorage';
import { fileValidation } from '../../../services/utils/fileValidation';
import Button from '../../common/UI/Button/Button';
import './profile.css';

const AvatarUpload = ({ 
  currentAvatar,
  onAvatarUpdate,
  maxSizeMB = 2,
  allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'],
}) => {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = fileValidation.validateFile(file, 'IMAGE');
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setAvatar(file);
    setError('');
    e.target.value = ''; // Reset input
  };

  const handleUpload = async () => {
    if (!avatar || typeof avatar === 'string') {
      setError('Please select a new image first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // In a real app, this would upload to server
      // const result = await cloudStorageService.uploadFile(avatar, setProgress);
      
      // Mock upload success
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        
        // Create mock uploaded URL
        const mockUrl = `https://example.com/avatars/${Date.now()}.jpg`;
        
        // Call callback with new avatar URL
        if (onAvatarUpdate) {
          onAvatarUpdate(mockUrl);
        }
        
        setSuccess('Avatar updated successfully!');
        setAvatar(mockUrl);
        
        // Clear preview URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl('');
        }
      }, 1500);
      
    } catch (err) {
      setError('Failed to upload avatar: ' + err.message);
      setProgress(0);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const handleRemoveAvatar = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    
    setAvatar(null);
    setError('');
    setSuccess('');
    
    // Call callback with null to indicate removal
    if (onAvatarUpdate) {
      onAvatarUpdate(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const displayAvatar = previewUrl || avatar;

  return (
    <div className="avatar-upload">
      {/* Current Avatar */}
      <div className="avatar-preview">
        <div className="avatar-container">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt="Profile avatar"
              className="avatar-image-preview"
            />
          ) : (
            <div className="avatar-placeholder-large">
              <span className="placeholder-icon">👤</span>
            </div>
          )}
          
          {uploading && (
            <div className="upload-progress-overlay">
              <div className="progress-circle">
                <div className="progress-text">{progress}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Controls */}
      <div className="avatar-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="file-input"
          disabled={uploading}
        />
        
        <div className="control-buttons">
          <Button
            onClick={triggerFileInput}
            variant="outline"
            size="sm"
            disabled={uploading}
          >
            Choose Image
          </Button>
          
          {displayAvatar && !previewUrl && (
            <Button
              onClick={handleRemoveAvatar}
              variant="ghost"
              size="sm"
              disabled={uploading}
            >
              Remove
            </Button>
          )}
        </div>
        
        {previewUrl && (
          <Button
            onClick={handleUpload}
            variant="primary"
            size="sm"
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="avatar-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {success && (
        <div className="avatar-success">
          <span className="success-icon">✅</span>
          {success}
        </div>
      )}

      {/* Requirements */}
      <div className="avatar-requirements">
        <p className="requirements-title">Requirements:</p>
        <ul className="requirements-list">
          <li>Max size: {maxSizeMB}MB</li>
          <li>Formats: JPG, PNG, WebP</li>
          <li>Recommended: Square image, 400x400px</li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarUpload;