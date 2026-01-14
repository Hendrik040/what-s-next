import { useState } from 'react';
import './Form.css';

function PersonForm({ onSubmit, people, events }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    company: '',
    location: '',
    notes: '',
    tags: '',
    eventId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    const personData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== ''),
    };

    try {
      await onSubmit(personData);
      setFormData({ name: '', email: '', phone: '', profession: '', company: '', location: '', notes: '', tags: '', eventId: '' });
    } catch {
      // Error is handled by parent component's error banner
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Person</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter person's name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Software Engineer, Designer, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
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
            placeholder="City, State/Country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventId">Met at Event (optional)</label>
          <select
            id="eventId"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
          >
            <option value="">Select an event...</option>
            {events && events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} - {new Date(event.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Additional notes about this person"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="work, friend, colleague (comma-separated)"
          />
        </div>

        <button type="submit" className="submit-btn">Add Person</button>
      </form>

      {people.length > 0 && (
        <div className="list-section">
          <h3>Existing People ({people.length})</h3>
          <ul className="item-list">
            {people.map(person => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                {person.profession && <span> - {person.profession}</span>}
                {person.company && <span> @ {person.company}</span>}
                {person.location && <span> ({person.location})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PersonForm;
