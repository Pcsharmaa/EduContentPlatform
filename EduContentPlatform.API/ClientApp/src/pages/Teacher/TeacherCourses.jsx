import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/api/teacher';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/UI/Button/Button';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await teacherService.getTeacherCourses();
        // support multiple response shapes
        const data = resp?.data || resp?.courses || resp || [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch teacher courses', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="teacher-courses page">
      <div className="page-header">
        <h2>Your Courses</h2>
        <div className="header-actions">
          <Button variant="primary" onClick={() => navigate('/teacher/upload')}>Create New Course</Button>
        </div>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="empty">
          <p>No courses found. Create your first course to get started.</p>
          <Button variant="primary" onClick={() => navigate('/teacher/upload')}>Create Course</Button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((c) => {
            const courseId = c.id || c.courseId;
            return (
              <div key={courseId} className="course-card">
                <div className="card-body">
                  <h3>{c.name || c.courseName}</h3>
                  <p className="muted">{c.description}</p>
                  <div className="meta">
                    <span>{(c.chapters && c.chapters.length) || c.chapters || 0} chapters</span>
                    <span>{c.students ? `${c.students} students` : ''}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to={`/teacher/courses/${courseId}`} onClick={() => console.debug('Navigate to course', courseId)}>
                    <Button variant="secondary">Manage</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
