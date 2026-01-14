# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**What's Next** is a full-stack knowledge graph application for tracking people, events, and their connections with interactive force-directed graph visualization. Built as a course/demo project with in-memory data storage.

## Architecture

### Frontend (client/)
- **React 19** + **Vite** development server
- **react-force-graph-2d** for interactive graph visualization
- **Axios** for API communication
- Runs on port **5173**

### Backend (server/)
- **Express.js** REST API
- **In-memory storage** using JavaScript Maps (data lost on restart)
- Runs on port **3001**

### Key Design Patterns

**State Management**: All state lives in `App.jsx` and flows down to components. `App.jsx` is the central hub for:
- Managing `graphData` state (people, events, connections)
- All API calls via Axios
- Tab navigation state
- Passing CRUD handlers to child components

**Data Model**:
- `Person`: {id (UUID), type: 'person', name*, email, phone, profession, company, location, notes, tags[], eventId}
- `Event`: {id (UUID), type: 'event', name*, date, location, description, attendees[]}
- `Connection`: {id (hash of person IDs), from*, to*, relationshipType, strength (1-5), notes, eventId}

**Connection Keys**: Connections use a deterministic bidirectional key via `connectionKey()` that sorts IDs alphabetically, ensuring `person1->person2` and `person2->person1` create the same connection.

**Cascade Deletion**: Deleting a person (DELETE `/api/people/:id`) automatically removes all connections involving that person in `server/index.js:101-117`.

## Development Commands

```bash
# Start both frontend + backend concurrently (recommended)
npm run dev

# Start backend only (port 3001)
npm run server

# Start frontend only (port 5173)
npm run client
# OR
cd client && npm run dev

# Build frontend for production
npm run build

# Lint frontend code
cd client && npm run lint

# Preview production build
cd client && npm run preview

# Start production server (frontend must be built first)
npm start
```

## API Endpoints

All endpoints are at `http://localhost:3001/api`

**Graph Data**:
- `GET /api/graph` - Returns {people[], events[], connections[]}

**People** (CRUD):
- `GET /api/people` | `POST /api/people` | `GET /api/people/:id` | `PUT /api/people/:id` | `DELETE /api/people/:id`
- Required field: `name`

**Events** (CRUD):
- `GET /api/events` | `POST /api/events` | `GET /api/events/:id` | `PUT /api/events/:id` | `DELETE /api/events/:id`
- Required field: `name`

**Connections** (Create, Read, Delete only - no Update):
- `GET /api/connections` | `POST /api/connections` | `DELETE /api/connections/:id`
- Required fields: `from` (person ID), `to` (person ID)
- Validates both people exist before creating

## Component Structure

**App.jsx** - Root component, owns all state and API logic

**GraphView.jsx** (`client/src/components/GraphView.jsx`):
- Renders force-directed graph using `ForceGraph2D`
- Green nodes (#4CAF50) = people, Blue nodes (#2196F3) = events
- Click nodes to show details panel with delete functionality
- Custom canvas rendering for node labels

**PersonForm.jsx** - Form to add people + list of existing people

**EventForm.jsx** - Form to add events + list of existing events

**ConnectionForm.jsx** - Form to create connections between people
- Includes relationship type dropdown (knows, friends, colleagues, family, met)
- Strength slider (1-5)
- Validates against self-connections

## Important Constraints

1. **No Edit Functionality**: UI only supports Create/Read/Delete. PUT endpoints exist but aren't wired to UI.

2. **Data Persistence**: All data is in-memory. Restarting the server wipes everything. This is intentional for the demo/course format.

3. **No Authentication**: Single-user application with no login system.

4. **CORS**: Wide-open CORS policy (`app.use(cors())`) - not production-safe.

5. **Graph Rendering**: Force-graph library uses Canvas, not SVG/DOM. Custom node rendering happens in `nodeCanvasObject` callback at `GraphView.jsx:40-65`.

## Implementation Guidelines

**External Libraries**: Always use Context7 MCP server when implementing features that require external tooling or libraries. Thoroughly check the documentation and use that context to implement features based on the latest docs rather than potentially outdated knowledge.

## Common Tasks

**Adding a new entity type**:
1. Add Map to `graph` object in `server/index.js:14-18`
2. Create CRUD endpoints following people/events pattern
3. Add to `/api/graph` response at `server/index.js:28-34`
4. Create form component in `client/src/components/`
5. Import and integrate in `App.jsx` with new tab + handler

**Modifying graph visualization**:
- Edit `GraphView.jsx:40-84` for node appearance/behavior
- Node colors, sizes, labels handled in `nodeCanvasObject`
- Link colors/widths in `linkColor`/`linkWidth` props

**Changing API port**: Update `PORT` in `server/index.js:7` AND `API_BASE` in `client/src/App.jsx:9`

## Future Enhancements Roadmap

See README.md for detailed list. Key planned features:
- Persistent database (SQLite/PostgreSQL)
- User authentication
- Export/import JSON data
- Search and filtering
- Timeline view
- Analytics/insights
- Edit functionality in UI
- Mobile responsive improvements



@client/src/components/GraphView.jsx is good 

