# What's Next - Knowledge Graph

A full-stack web application for tracking people and events using a knowledge graph visualization.

## Features

- **Add People**: Track people you've met with contact information, notes, and tags
- **Create Events**: Record events with dates, locations, and descriptions
- **Form Connections**: Link people together with different relationship types and strengths
- **Interactive Graph Visualization**: See your network of people and events visualized as an interactive force-directed graph
- **Node Details**: Click on any node to view detailed information and manage entries

## Technology Stack

- **Frontend**: React + Vite, react-force-graph-2d for graph visualization
- **Backend**: Node.js + Express
- **Data Storage**: In-memory graph database

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

### Running the Application

Start both the backend server and frontend client:

```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend React app on http://localhost:5173

Alternatively, you can run them separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## API Endpoints

### People
- `GET /api/people` - Get all people
- `POST /api/people` - Create a new person
- `GET /api/people/:id` - Get person by ID
- `PUT /api/people/:id` - Update person
- `DELETE /api/people/:id` - Delete person

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Connections
- `GET /api/connections` - Get all connections
- `POST /api/connections` - Create a new connection
- `DELETE /api/connections/:id` - Delete connection

### Graph
- `GET /api/graph` - Get complete graph data (people, events, and connections)

## Usage

1. **Add People**: Click on "Add Person" tab and fill in details
2. **Add Events**: Click on "Add Event" tab to record events
3. **Create Connections**: Use "Add Connection" tab to link people together
4. **View Graph**: The "Graph View" tab shows your knowledge graph with interactive visualization
5. **Interact**: Click on nodes to view details and delete entries

## Data Model

### Person
- id, name, email, phone, notes, tags[]

### Event
- id, name, date, location, description

### Connection
- from (person ID), to (person ID), relationshipType, strength (1-5), notes, eventId (optional)

## Future Enhancements

- Persistent data storage (database)
- User authentication
- Export/import graph data
- Advanced search and filtering
- Timeline view
- Analytics and insights
- Mobile responsive design improvements
- Real-time collaboration features
