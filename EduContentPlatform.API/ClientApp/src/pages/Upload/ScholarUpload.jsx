import React, { useState } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import './upload.css';
import { contentService } from '../../services/api/content';
import { teacherService } from '../../services/api/teacher';
import { useNavigate } from 'react-router-dom';

const ScholarUpload = () => {
  const [publication, setPublication] = useState({
    title: '',
    authors: '',
    journal: '',
    volume: '',
    issue: '',
    year: new Date().getFullYear(),
    abstract: '',
    keywords: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setPublication(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        // If a file is provided, upload first to teacher upload endpoint
        let fileUrl = null;
        if (publication.file) {
          const uploadResp = await teacherService.uploadFile({ file: publication.file, type: 'publication' });
          fileUrl = uploadResp.data?.fileUrl || uploadResp.fileUrl || uploadResp.data?.url || uploadResp.url;
        }

        const payload = {
          title: publication.title,
          authors: publication.authors,
          journal: publication.journal,
          volume: publication.volume,
          issue: publication.issue,
          year: publication.year,
          abstract: publication.abstract,
          keywords: publication.keywords,
          fileUrl,
        };

        const resp = await contentService.submitPublication(payload);
        // navigate back to publications list or dashboard
        if (resp && resp.publicationId) {
          navigate('/dashboard/publications');
        } else if (resp.data && resp.data.publicationId) {
          navigate('/dashboard/publications');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Submit failed', err);
        alert('Failed to submit publication');
      }
    })();
  };

  const navigate = useNavigate();

  return (
    <div className="upload-container scholar-upload">
        <div className="upload-header">
          <h2>Submit Research Publication</h2>
          <p>Share your research with the academic community</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <section className="form-section">
            <h3>Publication Information</h3>

            <FormInput
              label="Title"
              name="title"
              value={publication.title}
              onChange={handleChange}
              placeholder="Research title"
              required
            />

            <FormInput
              label="Authors"
              name="authors"
              value={publication.authors}
              onChange={handleChange}
              placeholder="Author names (comma separated)"
              required
            />

            <div className="form-row">
              <FormInput
                label="Journal/Publication"
                name="journal"
                value={publication.journal}
                onChange={handleChange}
                placeholder="Journal name"
              />
              <FormInput
                label="Year"
                type="number"
                name="year"
                value={publication.year}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <FormInput
                label="Volume"
                name="volume"
                value={publication.volume}
                onChange={handleChange}
                placeholder="e.g., 12"
              />
              <FormInput
                label="Issue"
                name="issue"
                value={publication.issue}
                onChange={handleChange}
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <label className="form-label">Abstract</label>
              <textarea
                name="abstract"
                value={publication.abstract}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Research abstract"
                rows="5"
                required
              />
            </div>

            <FormInput
              label="Keywords"
              name="keywords"
              value={publication.keywords}
              onChange={handleChange}
              placeholder="Separate keywords with commas"
            />
          </section>

          <section className="form-section">
            <h3>Upload Research Document</h3>
            
            <div className="file-upload">
              <label className="form-label">PDF File</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="file-input"
                accept=".pdf"
                required
              />
              <p className="file-hint">Maximum file size: 50MB</p>
            </div>
          </section>

          <div className="form-actions">
            <Button variant="primary" type="submit">
              Submit Publication
            </Button>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </div>
        </form>
      </div>
  );
};

export default ScholarUpload;
