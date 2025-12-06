import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import './performanceChart.css';

const PerformanceChart = ({ data, chartType = 'line', title, height = 300 }) => {
  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Default data if none provided
  const defaultData = [
    { month: 'Jan', reviews: 4, rating: 4.2, time: 5.2 },
    { month: 'Feb', reviews: 7, rating: 4.5, time: 4.8 },
    { month: 'Mar', reviews: 6, rating: 4.3, time: 5.0 },
    { month: 'Apr', reviews: 8, rating: 4.7, time: 4.5 },
    { month: 'May', reviews: 5, rating: 4.4, time: 5.1 },
    { month: 'Jun', reviews: 9, rating: 4.8, time: 4.3 },
  ];

  const chartData = data || defaultData;

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="reviews"
          stroke="#0088FE"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Reviews Completed"
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#00C49F"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Average Rating"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <Legend />
        <Bar dataKey="reviews" fill="#0088FE" name="Reviews Completed" />
        <Bar dataKey="time" fill="#FF8042" name="Avg Time (days)" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="rating"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
          name="Average Rating"
        />
        <Area
          type="monotone"
          dataKey="reviews"
          stackId="2"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
          name="Reviews Completed"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    const pieData = [
      { name: 'Accepted', value: 45 },
      { name: 'Minor Revision', value: 30 },
      { name: 'Major Revision', value: 15 },
      { name: 'Rejected', value: 10 },
    ];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, 'Percentage']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderRadarChart = () => {
    const radarData = [
      { subject: 'Quality', A: 90, fullMark: 100 },
      { subject: 'Timeliness', A: 85, fullMark: 100 },
      { subject: 'Detail', A: 95, fullMark: 100 },
      { subject: 'Feedback', A: 80, fullMark: 100 },
      { subject: 'Cooperation', A: 88, fullMark: 100 },
    ];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" stroke="#666" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#666" />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'area':
        return renderAreaChart();
      case 'pie':
        return renderPieChart();
      case 'radar':
        return renderRadarChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className="performance-chart">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-container">
        {renderChart()}
      </div>
      
      {/* Chart Stats Summary */}
      <div className="chart-stats">
        {chartType !== 'pie' && chartType !== 'radar' && (
          <>
            <div className="stat">
              <div className="stat-value">
                {chartData.reduce((sum, item) => sum + (item.reviews || 0), 0)}
              </div>
              <div className="stat-label">Total Reviews</div>
            </div>
            <div className="stat">
              <div className="stat-value">
                {(
                  chartData.reduce((sum, item) => sum + (item.rating || 0), 0) / 
                  chartData.filter(item => item.rating).length
                ).toFixed(1)}
              </div>
              <div className="stat-label">Avg Rating</div>
            </div>
            <div className="stat">
              <div className="stat-value">
                {(
                  chartData.reduce((sum, item) => sum + (item.time || 0), 0) / 
                  chartData.filter(item => item.time).length
                ).toFixed(1)}
              </div>
              <div className="stat-label">Avg Time (days)</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;