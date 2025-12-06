import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { teacherService } from '../../services/api/teacher';
import Button from '../../components/common/UI/Button/Button';

const CourseEdit = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({}); // chapterId -> boolean
  const [filesByChapter, setFilesByChapter] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await teacherService.getTeacherCourses();
        const list = resp?.data || resp?.courses || resp || [];
        const found = (Array.isArray(list) ? list : []).find(c => String(c.id || c.courseId) === String(id));
        if (found) setCourse(found);
      } catch (err) {
        console.error('Failed to load course', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleFileChange = (chapterId, file) => {
    if (!file) return;
    (async () => {
      setUploading(prev => ({ ...prev, [chapterId]: true }));
      try {
        const resp = await teacherService.uploadFile({
          file,
          courseId: course.id || course.courseId,
          chapterId,
          type: 'chapter',
        });

        // Refresh files for this chapter if API returns file list or file id
        try {
          const filesResp = await teacherService.getFilesByChapter(chapterId);
          const files = filesResp?.data || filesResp?.files || filesResp || [];
          setFilesByChapter(prev => ({ ...prev, [chapterId]: Array.isArray(files) ? files : [] }));
        } catch (e) {
          console.warn('Could not refresh files for chapter', chapterId, e);
        }

        alert('Upload complete');
      } catch (err) {
        console.error('Upload failed', err);
        alert('Upload failed');
      } finally {
        setUploading(prev => ({ ...prev, [chapterId]: false }));
      }
    })();
  };

  const fetchFilesForChapter = async (chapterId) => {
    try {
      const filesResp = await teacherService.getFilesByChapter(chapterId);
      const files = filesResp?.data || filesResp?.files || filesResp || [];
      setFilesByChapter(prev => ({ ...prev, [chapterId]: Array.isArray(files) ? files : [] }));
    } catch (e) {
      console.warn('Failed to fetch files for chapter', chapterId, e);
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="course-edit page">
      <div className="page-header">
        <h2>Manage Course: {course.name || course.courseName}</h2>
        <p className="muted">{course.description}</p>
      </div>

      <div className="chapters">
        <h3>Chapters</h3>
        {(course.chapters && course.chapters.length > 0) ? (
          course.chapters.map((ch) => (
            <div key={ch.id || ch.chapterId || ch.name} className="chapter-item">
              <div className="chapter-info">
                <strong>{ch.name || ch.chapterName}</strong>
                <p className="muted">{ch.description || ''}</p>
              </div>

              <div className="chapter-actions">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(ch.id || ch.chapterId || ch.name, e.target.files[0])}
                />
                <Button variant="secondary" onClick={() => fetchFilesForChapter(ch.id || ch.chapterId || ch.name)}>
                  Refresh Files
                </Button>
                {uploading[ch.id || ch.chapterId || ch.name] && <span className="muted">Uploading...</span>}
              </div>

              <div className="chapter-files">
                <h4>Files</h4>
                <ul>
                  {(filesByChapter[ch.id || ch.chapterId || ch.name] || []).map(f => (
                    <li key={f.id || f.fileId || f.url}>
                      <a href={f.url || f.path} target="_blank" rel="noreferrer">{f.name || f.fileName || f.url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>No chapters found for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CourseEdit;
