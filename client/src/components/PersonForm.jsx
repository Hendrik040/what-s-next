import { useState } from 'react';
import './Form.css';

function PersonForm({ onSubmit, people }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    tags: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
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

    onSubmit(personData);
    setFormData({ name: '', email: '', phone: '', notes: '', tags: '' });
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
                {person.email && <span> - {person.email}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PersonForm;
