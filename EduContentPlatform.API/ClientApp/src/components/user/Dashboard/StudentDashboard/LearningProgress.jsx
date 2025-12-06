import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import './LearningProgress.css';

const LearningProgress = ({ weeklyData = [] }) => {
  const defaultData = [
    { day: 'Mon', hours: 2, completed: 3 },
    { day: 'Tue', hours: 3, completed: 4 },
    { day: 'Wed', hours: 1.5, completed: 2 },
    { day: 'Thu', hours: 4, completed: 5 },
    { day: 'Fri', hours: 2.5, completed: 3 },
    { day: 'Sat', hours: 3.5, completed: 4 },
    { day: 'Sun', hours: 2, completed: 2 },
  ];

  const data = weeklyData.length > 0 ? weeklyData : defaultData;

  const coursesProgress = [
    { course: 'Mathematics', progress: 85, color: '#4361ee' },
    { course: 'Physics', progress: 72, color: '#3a0ca3' },
    { course: 'Computer Science', progress: 68, color: '#7209b7' },
    { course: 'Chemistry', progress: 55, color: '#f72585' },
    { course: 'Biology', progress: 42, color: '#4cc9f0' },
  ];

  const goals = [
    { title: 'Complete Algebra Course', deadline: '3 days', progress: 80 },
    { title: 'Finish 5 Physics Labs', deadline: '1 week', progress: 60 },
    { title: 'Achieve 90% in Math Quiz', deadline: '2 days', progress: 75 },
  ];

  return (
    <div className="learning-progress">
      <div className="progress-header">
        <h3>
          <TrendingUp size={20} />
          Learning Progress
        </h3>
        <div className="time-filter">
          <select>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="progress-charts">
        <div className="chart-container">
          <h4>Study Hours This Week</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#4361ee" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-summary">
            <div className="summary-item">
              <span className="label">Total Hours:</span>
              <span className="value">
                {data.reduce((sum, day) => sum + day.hours, 0)}h
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Avg. Daily:</span>
              <span className="value">
                {(data.reduce((sum, day) => sum + day.hours, 0) / data.length).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>

        <div className="courses-progress">
          <h4>Course Progress</h4>
          <div className="progress-bars">
            {coursesProgress.map((course, index) => (
              <div key={index} className="course-progress-item">
                <div className="course-info">
                  <span className="course-name">{course.course}</span>
                  <span className="course-percentage">{course.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: course.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="learning-goals">
        <h4>
          <Target size={18} />
          Learning Goals
        </h4>
        <div className="goals-list">
          {goals.map((goal, index) => (
            <div key={index} className="goal-item">
              <div className="goal-header">
                <h5>{goal.title}</h5>
                <span className="goal-deadline">Due: {goal.deadline}</span>
              </div>
              <div className="goal-progress">
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="goal-percentage">{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-insights">
        <div className="insight-card">
          <BarChart3 size={24} />
          <div className="insight-content">
            <h5>Consistency Score</h5>
            <p className="insight-value">88%</p>
            <p className="insight-desc">You've been consistent with your studies</p>
          </div>
        </div>
        <div className="insight-card">
          <TrendingUp size={24} />
          <div className="insight-content">
            <h5>Improvement Rate</h5>
            <p className="insight-value">+15%</p>
            <p className="insight-desc">Better than last week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;