import React, { useState } from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
// DashboardLayout is provided by the router; avoid wrapping pages with it
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import FormSelect from '../../components/common/Forms/FormSelect';
import './upload.css';

const UploadPage = () => {
  const [contentType, setContentType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Uploading:', { contentType, ...formData });
      if (contentType === 'publication') {
        // Submit publication metadata
        const payload = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price) || 0,
        };

        // If a file is provided, try to upload via teacherService
        if (formData.file) {
          const { teacherService } = await import('../../services/api/teacher');
          const uploadResp = await teacherService.uploadFile({ file: formData.file, type: 'publication' });
          payload.fileUrl = uploadResp.data?.fileUrl || uploadResp.fileUrl || uploadResp.url;
        }

        const { contentService } = await import('../../services/api/content');
        await contentService.submitPublication(payload);
        alert('Publication submitted');
      } else {
        alert('Upload type not implemented in this demo');
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  };

  const contentTypes = [
    { value: 'course', label: 'Course' },
    { value: 'publication', label: 'Publication' },
    { value: 'document', label: 'Document' },
    { value: 'video', label: 'Video' },
  ];

  const categories = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'biology', label: 'Biology' },
    { value: 'engineering', label: 'Engineering' },
  ];

  return (
    <div className="upload-container">
        <div className="upload-header">
          <h2>Upload Content</h2>
          <p>Share your educational resources with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <FormSelect
            label="Content Type"
            name="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            options={contentTypes}
            required
          />

          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter content title"
            required
          />

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe your content"
              rows="4"
              required
            />
          </div>

          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <FormInput
            label="Price ($)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0 for free content"
          />

          <div className="file-upload">
            <label className="form-label">Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="file-input"
              required
            />
          </div>

          <div className="form-actions">
            <Button variant="primary" type="submit">
              Upload Content
            </Button>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </div>
        </form>
      </div>
  );
};

export default UploadPage;
