const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory knowledge graph
const graph = {
  people: new Map(),
  events: new Map(),
  connections: new Map(),
};

// Helper function to create a connection key
const connectionKey = (id1, id2) => {
  return [id1, id2].sort().join('_');
};

// API Routes

// Get all graph data
app.get('/api/graph', (req, res) => {
  const people = Array.from(graph.people.values());
  const events = Array.from(graph.events.values());
  const connections = Array.from(graph.connections.values());

  res.json({ people, events, connections });
});

// People endpoints
app.post('/api/people', (req, res) => {
  const { name, email, phone, notes, tags, profession, company, location, eventId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const person = {
    id: uuidv4(),
    type: 'person',
    name,
    email: email || '',
    phone: phone || '',
    profession: profession || '',
    company: company || '',
    location: location || '',
    notes: notes || '',
    tags: tags || [],
    eventId: eventId || null,
    createdAt: new Date().toISOString(),
  };

  graph.people.set(person.id, person);
  res.status(201).json(person);
});

app.get('/api/people', (req, res) => {
  const people = Array.from(graph.people.values());
  res.json(people);
});

app.get('/api/people/:id', (req, res) => {
  const person = graph.people.get(req.params.id);
  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }
  res.json(person);
});

app.put('/api/people/:id', (req, res) => {
  const person = graph.people.get(req.params.id);
  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }

  const { name, email, phone, notes, tags, profession, company, location, eventId } = req.body;
  const updated = {
    ...person,
    name: name || person.name,
    email: email !== undefined ? email : person.email,
    phone: phone !== undefined ? phone : person.phone,
    profession: profession !== undefined ? profession : person.profession,
    company: company !== undefined ? company : person.company,
    location: location !== undefined ? location : person.location,
    notes: notes !== undefined ? notes : person.notes,
    tags: tags !== undefined ? tags : person.tags,
    eventId: eventId !== undefined ? eventId : person.eventId,
    updatedAt: new Date().toISOString(),
  };

  graph.people.set(person.id, updated);
  res.json(updated);
});

app.delete('/api/people/:id', (req, res) => {
  const deleted = graph.people.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Person not found' });
  }

  // Delete all connections involving this person
  const connectionsToDelete = [];
  for (const [key, conn] of graph.connections.entries()) {
    if (conn.from === req.params.id || conn.to === req.params.id) {
      connectionsToDelete.push(key);
    }
  }
  connectionsToDelete.forEach(key => graph.connections.delete(key));

  res.status(204).send();
});

// Events endpoints
app.post('/api/events', (req, res) => {
  const { name, date, location, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const event = {
    id: uuidv4(),
    type: 'event',
    name,
    date: date || new Date().toISOString(),
    location: location || '',
    description: description || '',
    attendees: [],
    createdAt: new Date().toISOString(),
  };

  graph.events.set(event.id, event);
  res.status(201).json(event);
});

app.get('/api/events', (req, res) => {
  const events = Array.from(graph.events.values());
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = graph.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

app.put('/api/events/:id', (req, res) => {
  const event = graph.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { name, date, location, description, attendees } = req.body;
  const updated = {
    ...event,
    name: name || event.name,
    date: date !== undefined ? date : event.date,
    location: location !== undefined ? location : event.location,
    description: description !== undefined ? description : event.description,
    attendees: attendees !== undefined ? attendees : event.attendees,
    updatedAt: new Date().toISOString(),
  };

  graph.events.set(event.id, updated);
  res.json(updated);
});

app.delete('/api/events/:id', (req, res) => {
  const deleted = graph.events.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Cascade cleanup: clear eventId references (similar to connection cleanup in DELETE /api/people/:id)
  // Clear eventId references from people
  for (const [id, person] of graph.people.entries()) {
    if (person.eventId === req.params.id) {
      graph.people.set(id, { ...person, eventId: null });
    }
  }

  // Clear eventId references from connections
  for (const [id, conn] of graph.connections.entries()) {
    if (conn.eventId === req.params.id) {
      graph.connections.set(id, { ...conn, eventId: null });
    }
  }

  res.status(204).send();
});

// Connections endpoints
app.post('/api/connections', (req, res) => {
  const { from, to, relationshipType, strength, notes, eventId } = req.body;

  if (!from || !to) {
    return res.status(400).json({ error: 'From and to are required' });
  }

  // Prevent self-connections
  if (from === to) {
    return res.status(400).json({ error: 'Cannot connect a person to themselves' });
  }

  if (!graph.people.has(from) || !graph.people.has(to)) {
    return res.status(404).json({ error: 'One or both people not found' });
  }

  const key = connectionKey(from, to);

  // Check for duplicate connections
  if (graph.connections.has(key)) {
    return res.status(409).json({ error: 'Connection already exists between these people' });
  }

  const connection = {
    id: key,
    from,
    to,
    relationshipType: relationshipType || 'knows',
    strength: Math.min(5, Math.max(1, parseInt(strength) || 1)),
    notes: notes || '',
    eventId: eventId || null,
    createdAt: new Date().toISOString(),
  };

  graph.connections.set(key, connection);
  res.status(201).json(connection);
});

app.get('/api/connections', (req, res) => {
  const connections = Array.from(graph.connections.values());
  res.json(connections);
});

app.delete('/api/connections/:id', (req, res) => {
  const deleted = graph.connections.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Connection not found' });
  }
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
