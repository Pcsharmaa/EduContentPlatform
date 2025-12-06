import React, { useState, useRef } from 'react';
import { fileUploadService } from '../../../services/storage/fileUpload';
import { fileValidation } from '../../../services/utils/fileValidation';
import './upload.css';

const FileUploader = ({
  onFileSelect,
  acceptedTypes = [],
  maxSizeMB = 10,
  multiple = false,
  label = 'Upload Files',
  helperText = 'Drag & drop files here or click to browse',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const handleFiles = (files) => {
    const validationResults = fileValidation.validateFiles(files, 'DEFAULT');
    
    // Filter out files that exceed maxSizeMB
    const validFiles = files.filter(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrors(prev => [...prev, `${file.name} exceeds maximum size of ${maxSizeMB}MB`]);
        return false;
      }
      
      if (acceptedTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        const isTypeAllowed = acceptedTypes.some(type => 
          type.toLowerCase() === file.type.toLowerCase() || 
          type.toLowerCase() === fileExtension
        );
        
        if (!isTypeAllowed) {
          setErrors(prev => [...prev, `${file.name} type not allowed`]);
          return false;
        }
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles);
      
      if (onFileSelect) {
        onFileSelect(multiple ? newFiles : newFiles[0]);
      }
      
      setErrors([]);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : newFiles[0] || null);
    }
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setErrors([]);
    if (onFileSelect) {
      onFileSelect(multiple ? [] : null);
    }
  };

  const formatFileSize = (bytes) => {
    return fileUploadService.formatFileSize(bytes);
  };

  return (
    <div className="file-uploader">
      <div className="uploader-header">
        <label className="uploader-label">{label}</label>
        {selectedFiles.length > 0 && (
          <button
            type="button"
            onClick={clearAllFiles}
            className="clear-all-button"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="file-input"
          disabled={disabled}
        />
        
        <div className="drop-zone-content">
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            {helperText}
          </div>
          <div className="upload-subtext">
            Max file size: {maxSizeMB}MB • Supported: {acceptedTypes.join(', ') || 'All files'}
          </div>
          <button
            type="button"
            className="browse-button"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
            disabled={disabled}
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="upload-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <div className="files-header">
            <span className="files-count">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="files-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-icon">
                    {fileValidation.getFileIcon(file.name)}
                  </span>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="remove-file-button"
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;