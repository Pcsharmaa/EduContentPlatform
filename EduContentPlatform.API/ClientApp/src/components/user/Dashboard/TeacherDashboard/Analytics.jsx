import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Users, Eye, Download, Star,
  Calendar, Target, DollarSign, BarChart3,
  ArrowUp, ArrowDown
} from 'lucide-react';

const Analytics = ({ timeRange = '30d', detailed = false }) => {
  const [chartData, setChartData] = useState([]);
  const [contentPerformance, setContentPerformance] = useState([]);
  const [studentDemographics, setStudentDemographics] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // Simulate data fetching based on timeRange
    const generateData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: Math.floor(Math.random() * 500) + 200,
          enrollments: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 500) + 100,
          completion: Math.floor(Math.random() * 30) + 60,
        });
      }
      
      setChartData(data);
    };

    generateData();
  }, [timeRange]);

  useEffect(() => {
    // Content performance data
    setContentPerformance([
      { name: 'Advanced Calculus', views: 1240, enrollments: 156, revenue: 1240, rating: 4.8 },
      { name: 'Physics 101', views: 980, enrollments: 124, revenue: 980, rating: 4.7 },
      { name: 'Python Programming', views: 2100, enrollments: 245, revenue: 2100, rating: 4.9 },
      { name: 'Chemistry Basics', views: 450, enrollments: 89, revenue: 450, rating: 4.6 },
      { name: 'Data Structures', views: 320, enrollments: 67, revenue: 320, rating: 4.5 },
    ]);

    // Student demographics
    setStudentDemographics([
      { name: '18-24', value: 35, color: '#4361ee' },
      { name: '25-34', value: 45, color: '#3a0ca3' },
      { name: '35-44', value: 12, color: '#7209b7' },
      { name: '45+', value: 8, color: '#f72585' },
    ]);

    // Revenue data
    setRevenueData([
      { month: 'Jan', direct: 4000, platform: 2400 },
      { month: 'Feb', direct: 3000, platform: 1398 },
      { month: 'Mar', direct: 2000, platform: 9800 },
      { month: 'Apr', direct: 2780, platform: 3908 },
      { month: 'May', direct: 1890, platform: 4800 },
      { month: 'Jun', direct: 2390, platform: 3800 },
    ]);
  }, []);

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$12,480',
      change: '+15%',
      trend: 'up',
      icon: <DollarSign size={24} />,
      color: 'green'
    },
    {
      title: 'Avg. Course Rating',
      value: '4.7',
      change: '+0.2',
      trend: 'up',
      icon: <Star size={24} />,
      color: 'yellow'
    },
    {
      title: 'Student Engagement',
      value: '78%',
      change: '+8%',
      trend: 'up',
      icon: <Users size={24} />,
      color: 'blue'
    },
    {
      title: 'Completion Rate',
      value: '65%',
      change: '-2%',
      trend: 'down',
      icon: <Target size={24} />,
      color: 'purple'
    },
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div className="header-left">
          <h3>
            <BarChart3 size={24} />
            Performance Analytics
          </h3>
          <p>Track your teaching performance and student engagement</p>
        </div>
        <div className="header-actions">
          <div className="time-range-selector">
            {timeRangeOptions.map(option => (
              <button
                key={option.value}
                className={`time-range-btn ${timeRange === option.value ? 'active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className="btn-secondary">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={`metric-card ${metric.color}`}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h4>{metric.value}</h4>
              <p>{metric.title}</p>
              <span className={`metric-change ${metric.trend}`}>
                {metric.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card full-width">
          <div className="chart-header">
            <h4>Performance Overview</h4>
            <div className="chart-legend">
              <span className="legend-item views">● Views</span>
              <span className="legend-item enrollments">● Enrollments</span>
              <span className="legend-item revenue">● Revenue</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4361ee"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Enrollments"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {detailed && (
          <>
            <div className="chart-card">
              <div className="chart-header">
                <h4>Student Demographics</h4>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={studentDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Revenue Breakdown</h4>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="direct" fill="#4361ee" name="Direct Sales" />
                    <Bar dataKey="platform" fill="#4cc9f0" name="Platform Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {detailed && (
        <div className="content-performance">
          <div className="section-header">
            <h4>Top Performing Content</h4>
            <button className="view-all">View All →</button>
          </div>
          <div className="performance-table">
            <div className="table-header">
              <div className="table-cell">Course Name</div>
              <div className="table-cell">Views</div>
              <div className="table-cell">Enrollments</div>
              <div className="table-cell">Revenue</div>
              <div className="table-cell">Rating</div>
              <div className="table-cell">Performance</div>
            </div>
            {contentPerformance.map((course, index) => (
              <div key={index} className="table-row">
                <div className="table-cell name">
                  <div className="course-info">
                    <div className="course-thumb"></div>
                    <span>{course.name}</span>
                  </div>
                </div>
                <div className="table-cell">{course.views.toLocaleString()}</div>
                <div className="table-cell">{course.enrollments}</div>
                <div className="table-cell">${course.revenue.toLocaleString()}</div>
                <div className="table-cell">
                  <div className="rating-display">
                    <span className="stars">{"★".repeat(Math.floor(course.rating))}</span>
                    <span className="value">{course.rating}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="performance-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${(course.enrollments / 300) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="insights-section">
        <h4>Key Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <TrendingUp size={20} />
            <div className="insight-content">
              <h5>Peak Engagement</h5>
              <p>Most students are active between 6 PM - 9 PM</p>
            </div>
          </div>
          <div className="insight-card">
            <Star size={20} />
            <div className="insight-content">
              <h5>High Ratings</h5>
              <p>Courses with video content receive 40% higher ratings</p>
            </div>
          </div>
          <div className="insight-card">
            <Users size={20} />
            <div className="insight-content">
              <h5>Student Retention</h5>
              <p>85% of enrolled students complete at least 70% of course</p>
            </div>
          </div>
          <div className="insight-card">
            <Calendar size={20} />
            <div className="insight-content">
              <h5>Optimal Publish Time</h5>
              <p>Content published on Wednesdays gets 30% more views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;