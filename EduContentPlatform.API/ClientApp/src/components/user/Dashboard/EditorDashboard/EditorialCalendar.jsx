import React, { useState, useEffect } from 'react';
import { useEditorial } from '../../../hooks/useEditorial';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EditorialCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [viewMode, setViewMode] = useState('month');

  const { getEditorialCalendar } = useEditorial();

  useEffect(() => {
    fetchCalendarEvents();
  }, [selectedDate]);

  const fetchCalendarEvents = async () => {
    try {
      const events = await getEditorialCalendar({
        startDate: selectedDate,
        endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      });
      setCalendarEvents(events);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    }
  };

  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const events = getEventsForDate(date);
      if (events.length > 0) {
        return (
          <div className="calendar-events">
            {events.slice(0, 3).map(event => (
              <div 
                key={event.id} 
                className={`calendar-event ${event.type}`}
                title={event.title}
              >
                •
              </div>
            ))}
            {events.length > 3 && (
              <div className="more-events">+{events.length - 3}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="editorial-calendar">
      <div className="calendar-header">
        <h2>Editorial Calendar</h2>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button 
            className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button 
            className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          onClickDay={(value) => setSelectedDate(value)}
        />
      </div>

      {/* Event List for Selected Date */}
      <div className="selected-date-events">
        <h3>Events for {selectedDate.toDateString()}</h3>
        <div className="event-list">
          {getEventsForDate(selectedDate).map(event => (
            <div key={event.id} className={`event-item ${event.type}`}>
              <div className="event-time">{event.time}</div>
              <div className="event-details">
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <div className="event-meta">
                  <span>Type: {event.contentType}</span>
                  <span>Status: {event.status}</span>
                  {event.assignee && <span>Assignee: {event.assignee}</span>}
                </div>
              </div>
              <div className="event-actions">
                <button className="btn btn-sm">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="upcoming-deadlines">
        <h3>Upcoming Deadlines</h3>
        <div className="deadline-list">
          {calendarEvents
            .filter(event => new Date(event.deadline) > new Date())
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5)
            .map(deadline => (
              <div key={deadline.id} className="deadline-item">
                <div className="deadline-date">
                  {new Date(deadline.deadline).toLocaleDateString()}
                </div>
                <div className="deadline-content">
                  <strong>{deadline.title}</strong>
                  <small>Reviewer: {deadline.reviewer}</small>
                </div>
                <div className={`deadline-status ${deadline.status}`}>
                  {deadline.status}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialCalendar;
