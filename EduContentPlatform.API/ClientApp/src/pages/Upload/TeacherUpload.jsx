import React, { useState } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import './upload.css';
import { teacherService } from '../../services/api/teacher';
import { useNavigate } from 'react-router-dom';

const TeacherUpload = () => {
  const [courseData, setCourseData] = useState({
    courseName: '',
    description: '',
    category: '',
    level: 'beginner',
  });
  const [loading, setLoading] = useState(false);

  const [chapters, setChapters] = useState([
    { id: 1, name: 'Introduction', lessons: 3 },
  ]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      try {
        // Prepare payload - teacherService.createCourse expects form fields optionally with a thumbnail file
        const payload = {
          courseName: courseData.courseName,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          chapters: JSON.stringify(chapters.map(c => ({ name: c.name, lessons: c.lessons }))),
        };

        const resp = await teacherService.createCourse(payload);
        // Try to extract id from response in several possible shapes
        const courseId = resp?.data?.courseId || resp?.courseId || resp?.data?.id || resp?.id;

        // If chapters exist and backend created courseId, create chapters
        if (courseId && chapters.length > 0) {
          for (const ch of chapters) {
            if (!ch.name) continue;
            try {
              await teacherService.createChapter(courseId, { chapterName: ch.name, sortOrder: ch.sortOrder || 0 });
            } catch (err) {
              // continue creating other chapters even if one fails
              console.warn('Failed to create chapter', ch.name, err);
            }
          }
        }

        alert('Course created successfully');
        navigate('/dashboard');
      } catch (err) {
        console.error('Create course failed', err);
        alert('Failed to create course');
      } finally {
        setLoading(false);
      }
    })();
  };

  const addChapter = () => {
    const newId = Math.max(...chapters.map(c => c.id), 0) + 1;
    setChapters([...chapters, { id: newId, name: '', lessons: 0 }]);
  };

  const navigate = useNavigate();

  return (
    <div className="upload-container teacher-upload">
        <div className="upload-header">
          <h2>Create New Course</h2>
          <p>Build a comprehensive course for your students</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <section className="form-section">
            <h3>Course Details</h3>
            
            <FormInput
              label="Course Name"
              name="courseName"
              value={courseData.courseName}
              onChange={handleCourseChange}
              placeholder="e.g., Introduction to Physics"
              required
            />

            <div>
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleCourseChange}
                className="form-textarea"
                placeholder="Describe what students will learn"
                rows="4"
              />
            </div>

            <div className="form-row">
              <FormInput
                label="Category"
                name="category"
                value={courseData.category}
                onChange={handleCourseChange}
                placeholder="e.g., Science"
              />
              <div>
                <label className="form-label">Level</label>
                <select
                  name="level"
                  value={courseData.level}
                  onChange={handleCourseChange}
                  className="form-select"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Course Chapters</h3>
              <Button variant="secondary" type="button" onClick={addChapter}>
                + Add Chapter
              </Button>
            </div>

            <div className="chapters-list">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="chapter-item">
                  <span className="chapter-number">{index + 1}</span>
                  <FormInput
                    label="Chapter Name"
                    value={chapter.name}
                    onChange={(e) => {
                      const updated = [...chapters];
                      updated[index].name = e.target.value;
                      setChapters(updated);
                    }}
                    placeholder="Enter chapter name"
                  />
                  <span className="chapter-lessons">{chapter.lessons} lessons</span>
                </div>
              ))}
            </div>
          </section>

          <div className="form-actions">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/dashboard')}>Cancel</Button>
          </div>
        </form>
      </div>
  );
};

export default TeacherUpload;
