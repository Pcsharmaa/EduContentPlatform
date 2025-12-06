import React, { useState, useEffect } from 'react';
import { useContent } from '../../../../hooks/useContent';
import ContentGrid from '../../../content/ContentGrid/ContentGrid';
import LearningProgress from './LearningProgress';
import Bookmarks from './Bookmarks';
import { BookOpen, Clock, Award, TrendingUp, Calendar, Target, Users } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { recentContent, loading, error, fetchStudentDashboard } = useContent();
  const [activeTab, setActiveTab] = useState('overview');
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    studyHours: 0,
    certificates: 0,
    progressRate: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchStudentDashboard();
        setStats({
          enrolledCourses: data.enrolledCourses,
          studyHours: data.studyHours,
          certificates: data.certificates,
          progressRate: data.progressRate
        });
        setWeeklyProgress(data.weeklyProgress || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };
    loadDashboardData();
  }, [fetchStudentDashboard]);

  const dashboardStats = [
    { 
      icon: <BookOpen size={24} />, 
      label: 'Courses Enrolled', 
      value: stats.enrolledCourses, 
      change: '+2 this week',
      color: 'blue'
    },
    { 
      icon: <Clock size={24} />, 
      label: 'Study Hours', 
      value: `${stats.studyHours}h`, 
      change: '+5h this week',
      color: 'green'
    },
    { 
      icon: <Award size={24} />, 
      label: 'Certificates', 
      value: stats.certificates, 
      change: '+1 earned',
      color: 'yellow'
    },
    { 
      icon: <TrendingUp size={24} />, 
      label: 'Progress Rate', 
      value: `${stats.progressRate}%`, 
      change: '+12%',
      color: 'purple'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'My Courses' },
    { id: 'progress', label: 'Progress' },
    { id: 'achievements', label: 'Achievements' },
  ];

  const upcomingClasses = [
    { title: 'Mathematics 101', time: '10:00 AM', instructor: 'Dr. Smith' },
    { title: 'Physics Lab', time: '2:00 PM', instructor: 'Prof. Johnson' },
    { title: 'Computer Science', time: '4:00 PM', instructor: 'Dr. Williams' },
  ];

  const recentActivities = [
    { activity: 'Completed "Algebra Basics" quiz', time: '2 hours ago', type: 'quiz' },
    { activity: 'Watched "Introduction to Physics"', time: '1 day ago', type: 'video' },
    { activity: 'Submitted assignment on Calculus', time: '2 days ago', type: 'assignment' },
    { activity: 'Earned "Math Whiz" badge', time: '3 days ago', type: 'badge' },
  ];

  return (
    <div className="student-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h2>Welcome back, Alex!</h2>
          <p>You're making great progress in your learning journey. Keep it up!</p>
          <div className="streak-counter">
            <span>🔥 15-day learning streak</span>
          </div>
        </div>
        <div className="welcome-actions">
          <button className="btn-primary">
            <BookOpen size={18} />
            Continue Learning
          </button>
          <button className="btn-outline">
            <Target size={18} />
            Set Goals
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className={`dashboard-stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="main-section">
          <div className="section-header">
            <h3>Continue Learning</h3>
            <button className="view-all">View All →</button>
          </div>
          {loading ? (
            <div className="loading-content">Loading your courses...</div>
          ) : error ? (
            <div className="error-content">Error loading content</div>
          ) : (
            <ContentGrid content={recentContent.slice(0, 3)} />
          )}

          <div className="progress-section">
            <LearningProgress weeklyData={weeklyProgress} />
          </div>
        </div>

        <div className="sidebar-section">
          <div className="upcoming-classes">
            <h4>
              <Calendar size={18} />
              Upcoming Classes
            </h4>
            <ul className="classes-list">
              {upcomingClasses.map((cls, index) => (
                <li key={index} className="class-item">
                  <div className="class-time">{cls.time}</div>
                  <div className="class-info">
                    <strong>{cls.title}</strong>
                    <span>with {cls.instructor}</span>
                  </div>
                  <button className="join-btn">Join</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bookmarks-section">
            <Bookmarks />
          </div>

          <div className="recent-activity">
            <h4>
              <Users size={18} />
              Recent Activity
            </h4>
            <ul className="activity-list">
              {recentActivities.map((activity, index) => (
                <li key={index} className={`activity-item ${activity.type}`}>
                  <div className="activity-content">
                    <p>{activity.activity}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;