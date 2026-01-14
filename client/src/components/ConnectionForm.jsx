import { useState } from 'react';
import './Form.css';

function ConnectionForm({ onSubmit, people, events }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    relationshipType: 'knows',
    strength: 1,
    notes: '',
    eventId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to) {
      alert('Please select two people to connect');
      return;
    }

    if (formData.from === formData.to) {
      alert('Cannot create a connection between the same person');
      return;
    }

    const connectionData = {
      ...formData,
      strength: parseInt(formData.strength, 10),
      eventId: formData.eventId || null,
    };

    try {
      await onSubmit(connectionData);
      setFormData({
        from: '',
        to: '',
        relationshipType: 'knows',
        strength: 1,
        notes: '',
        eventId: '',
      });
    } catch {
      // Error is handled by parent component's error banner
    }
  };

  return (
    <div className="form-container">
      <h2>Add Connection</h2>
      {people.length < 2 ? (
        <div className="empty-state-small">
          <p>You need at least 2 people to create a connection.</p>
          <p>Please add more people first.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="from">Person 1 *</label>
            <select
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
            >
              <option value="">Select a person</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="to">Person 2 *</label>
            <select
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
            >
              <option value="">Select a person</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="relationshipType">Relationship Type</label>
            <select
              id="relationshipType"
              name="relationshipType"
              value={formData.relationshipType}
              onChange={handleChange}
            >
              <option value="knows">Knows</option>
              <option value="friends">Friends</option>
              <option value="colleagues">Colleagues</option>
              <option value="family">Family</option>
              <option value="met">Met</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="strength">Connection Strength (1-5)</label>
            <input
              type="range"
              id="strength"
              name="strength"
              min="1"
              max="5"
              value={formData.strength}
              onChange={handleChange}
            />
            <span className="strength-value">{formData.strength}</span>
          </div>

          <div className="form-group">
            <label htmlFor="eventId">Met at Event (optional)</label>
            <select
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
            >
              <option value="">None</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
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
              rows="3"
              placeholder="Additional notes about this connection"
            />
          </div>

          <button type="submit" className="submit-btn">Add Connection</button>
        </form>
      )}
    </div>
  );
}

export default ConnectionForm;
