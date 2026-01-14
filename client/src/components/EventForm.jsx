import { useState } from 'react';
import './Form.css';

function EventForm({ onSubmit, events }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Event name is required');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: '', date: '', location: '', description: '' });
    } catch {
      // Error is handled by parent component's error banner
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Event Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter event name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Event description"
          />
        </div>

        <button type="submit" className="submit-btn">Add Event</button>
      </form>

      {events.length > 0 && (
        <div className="list-section">
          <h3>Existing Events ({events.length})</h3>
          <ul className="item-list">
            {events.map(event => (
              <li key={event.id}>
                <strong>{event.name}</strong>
                {event.location && <span> - {event.location}</span>}
                {event.date && (
                  <span className="date">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventForm;
