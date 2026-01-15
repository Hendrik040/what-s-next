# Implementation Phases
# What's Next - Knowledge Graph Application

**Version:** 1.0
**Last Updated:** January 2026
**Related Document:** [PRD.md](./PRD.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Phase Summary](#phase-summary)
3. [Phase 1: Core MVP](#phase-1-core-mvp) ✅ Complete
4. [Phase 2: Data Persistence](#phase-2-data-persistence)
5. [Phase 3: Enhanced Features](#phase-3-enhanced-features)
6. [Phase 4: User Experience](#phase-4-user-experience)
7. [Phase 5: Multi-User & Collaboration](#phase-5-multi-user--collaboration)
8. [Phase 6: Telegram Integration](#phase-6-telegram-integration)
9. [Phase Dependencies](#phase-dependencies)
10. [Technical Debt & Maintenance](#technical-debt--maintenance)

---

## Overview

This document outlines the implementation phases for the What's Next knowledge graph application.

### Core Concept: The Knowledge Graph

At its heart, **What's Next** is a **knowledge graph** - a network of entities (people, events) and the relationships between them. Unlike traditional contact lists or CRMs that store flat records, the knowledge graph captures:

- **Nodes**: People you know, events you attend
- **Edges**: Explicit connections with relationship metadata (type, strength, context)
- **Context**: Where and how relationships formed

The graph visualization isn't just a feature - it's the primary way to explore and understand your network. Every other feature (search, analytics, integrations) serves to enrich or interact with this graph.

### Guiding Principles

1. **Graph-First Thinking:** Every feature should enhance the knowledge graph
2. **Incremental Value:** Each phase delivers usable functionality
3. **Backward Compatibility:** Existing data and workflows continue to work
4. **Technical Foundation First:** Infrastructure changes precede feature changes
5. **Multiple Input Channels:** The graph can be populated from various sources (web UI, Telegram, imports)

---

## Phase Summary

| Phase | Name | Status | Focus Area |
|-------|------|--------|------------|
| 1 | Core MVP | ✅ Complete | Basic CRUD, graph visualization |
| 2 | Data Persistence | 🔲 Planned | Database, data durability |
| 3 | Enhanced Features | 🔲 Planned | Edit, search, export/import |
| 4 | User Experience | 🔲 Planned | Timeline, analytics, mobile |
| 5 | Multi-User | 🔲 Planned | Auth, sharing, collaboration |
| 6 | Telegram Integration | 🔲 Planned | Add contacts via Telegram bot |

---

## Phase 1: Core MVP

**Status:** ✅ Complete
**Goal:** Establish core functionality for tracking people, events, and connections with graph visualization.

### 1.1 Overview

Phase 1 delivers a functional knowledge graph application with:
- Full CRUD operations for People and Events
- Create/Delete operations for Connections
- Interactive force-directed graph visualization
- RESTful API backend with in-memory storage

### 1.2 Completed Features

#### Epic 1.1: People Management

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| F1.1.1 | Create Person | ✅ Done | Form with 9 fields (name required) |
| F1.1.2 | List People | ✅ Done | Display all people below form |
| F1.1.3 | View Person Details | ✅ Done | Click node to see details panel |
| F1.1.4 | Delete Person | ✅ Done | Delete from details panel with cascade |

**Technical Implementation:**
- Frontend: `PersonForm.jsx` component with controlled form inputs
- Backend: `/api/people` CRUD endpoints in `server/index.js`
- Storage: `graph.people` Map with UUID keys
- Cascade: Delete removes all connections involving the person

**Acceptance Criteria (Verified):**
- [x] Name field required, validation error shown if empty
- [x] Tags parsed from comma-separated string to array
- [x] Event dropdown populated with existing events
- [x] Person appears in graph immediately after creation
- [x] Deletion cascades to remove all related connections

---

#### Epic 1.2: Event Management

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| F1.2.1 | Create Event | ✅ Done | Form with 4 fields (name required) |
| F1.2.2 | List Events | ✅ Done | Display all events below form |
| F1.2.3 | View Event Details | ✅ Done | Click node to see details panel |
| F1.2.4 | Delete Event | ✅ Done | Delete from details panel with cleanup |

**Technical Implementation:**
- Frontend: `EventForm.jsx` component
- Backend: `/api/events` CRUD endpoints
- Storage: `graph.events` Map with UUID keys
- Cleanup: Delete sets `eventId` to null on referencing entities

**Acceptance Criteria (Verified):**
- [x] Name field required
- [x] Date defaults to current timestamp if not provided
- [x] Datetime-local picker for date input
- [x] Event appears as blue node in graph
- [x] Deletion clears eventId references (soft delete cascade)

---

#### Epic 1.3: Connection Management

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| F1.3.1 | Create Connection | ✅ Done | Link two people with metadata |
| F1.3.2 | Delete Connection | ✅ Done | API endpoint (no direct UI trigger) |

**Technical Implementation:**
- Frontend: `ConnectionForm.jsx` with dual dropdowns
- Backend: `/api/connections` endpoints
- Storage: `graph.connections` Map with deterministic bidirectional key
- Key Generation: `connectionKey(id1, id2)` sorts IDs alphabetically

**Acceptance Criteria (Verified):**
- [x] Requires minimum 2 people to show form
- [x] Self-connection prevented (from === to validation)
- [x] Duplicate connection prevented (409 Conflict)
- [x] Relationship types: knows, friends, colleagues, family, met
- [x] Strength slider 1-5 with numeric display
- [x] Connection appears as link in graph immediately

---

#### Epic 1.4: Graph Visualization

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| F1.4.1 | Force-Directed Graph | ✅ Done | Interactive canvas-based graph |
| F1.4.2 | Node Interaction | ✅ Done | Click, drag, hover behaviors |
| F1.4.3 | Details Panel | ✅ Done | Slide-in panel on node click |
| F1.4.4 | Legend | ✅ Done | Color legend for node types |
| F1.4.5 | Empty State | ✅ Done | Guidance when graph is empty |

**Technical Implementation:**
- Library: `react-force-graph-2d` with Canvas rendering
- Colors: People (#4CAF50 green), Events (#2196F3 blue)
- Physics: Velocity decay 0.3, link curvature 0.1
- Custom rendering: `nodeCanvasObject` callback for labels

**Acceptance Criteria (Verified):**
- [x] Graph renders in responsive container
- [x] Nodes draggable to new positions
- [x] Hover shows name tooltip
- [x] Click opens details panel
- [x] Directional arrows on links
- [x] Legend displays in fixed position

---

#### Epic 1.5: Error Handling

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| F1.5.1 | Error Banner | ✅ Done | Global error display |
| F1.5.2 | Auto-Dismiss | ✅ Done | Errors clear after 5 seconds |
| F1.5.3 | API Error Mapping | ✅ Done | Server errors shown to user |

**Technical Implementation:**
- State: `error` state in `App.jsx`
- Display: Conditional banner at top of app
- Timeout: `useEffect` with 5-second timer
- Sources: Axios catch blocks extract error messages

---

### 1.3 Technical Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | React useState in App.jsx | Simple app, no Redux overhead needed |
| Graph Library | react-force-graph-2d | Canvas performance, good API |
| Data Storage | In-memory Maps | Demo simplicity, no DB setup |
| ID Generation | UUID v4 | Globally unique, no collisions |
| Connection Keys | Sorted bidirectional | Prevents A→B and B→A duplicates |

### 1.4 Known Limitations (Phase 1)

| Limitation | Impact | Addressed In |
|------------|--------|--------------|
| No data persistence | Data lost on restart | Phase 2 |
| No edit UI | Must delete and recreate | Phase 3 |
| No search/filter | Hard to find entities in large graphs | Phase 3 |
| No authentication | Single user only | Phase 5 |
| Wide-open CORS | Not production-safe | Phase 5 |

---

## Phase 2: Data Persistence

**Status:** 🔲 Planned
**Goal:** Add persistent data storage so data survives server restarts.

### 2.1 Overview

Phase 2 introduces a database layer, enabling:
- Data persistence across server restarts
- Foundation for future features (search, multi-user)
- Backup and restore capabilities
- Data migration from in-memory to persistent storage

### 2.2 Features

#### Epic 2.1: Database Integration

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F2.1.1 | Database Selection | P0 | Choose and integrate SQLite or PostgreSQL |
| F2.1.2 | Schema Design | P0 | Create database tables for all entities |
| F2.1.3 | ORM/Query Layer | P0 | Implement data access layer |
| F2.1.4 | Migration System | P1 | Version-controlled schema migrations |

**Feature: F2.1.1 - Database Selection**

*Decision Matrix:*

| Criteria | SQLite | PostgreSQL |
|----------|--------|------------|
| Setup Complexity | Low (file-based) | Medium (server required) |
| Scalability | Limited | High |
| Concurrent Users | Limited | Excellent |
| JSON Support | Basic | Native JSONB |
| Hosting Options | Embedded | Cloud-ready |
| Best For | Single-user, local | Multi-user, production |

*Recommendation:* Start with **SQLite** for simplicity, design schema to be PostgreSQL-compatible for future migration.

*Acceptance Criteria:*
- [ ] Database runs without external server/service
- [ ] Data persists after server restart
- [ ] No changes required to frontend
- [ ] Performance comparable to in-memory for < 1000 entities

---

**Feature: F2.1.2 - Schema Design**

*Proposed Schema:*

```sql
-- People table
CREATE TABLE people (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'person',
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    profession TEXT DEFAULT '',
    company TEXT DEFAULT '',
    location TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',  -- JSON array stored as text
    event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

-- Events table
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'event',
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT DEFAULT '',
    description TEXT DEFAULT '',
    attendees TEXT DEFAULT '[]',  -- JSON array stored as text
    created_at TEXT NOT NULL,
    updated_at TEXT
);

-- Connections table
CREATE TABLE connections (
    id TEXT PRIMARY KEY,  -- Deterministic key: sorted(from, to).join('_')
    from_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    to_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'knows',
    strength INTEGER DEFAULT 1 CHECK (strength >= 1 AND strength <= 5),
    notes TEXT DEFAULT '',
    event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    UNIQUE(from_person_id, to_person_id)
);

-- Indexes for common queries
CREATE INDEX idx_people_name ON people(name);
CREATE INDEX idx_people_event_id ON people(event_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_connections_from ON connections(from_person_id);
CREATE INDEX idx_connections_to ON connections(to_person_id);
```

*Acceptance Criteria:*
- [ ] Schema supports all existing entity fields
- [ ] Foreign key constraints enforce referential integrity
- [ ] CASCADE and SET NULL behaviors match current implementation
- [ ] Indexes support common query patterns
- [ ] Schema is forward-compatible with PostgreSQL

---

**Feature: F2.1.3 - ORM/Query Layer**

*Technology Options:*

| Option | Pros | Cons |
|--------|------|------|
| **better-sqlite3** | Fast, synchronous, simple | SQLite only |
| **Knex.js** | Query builder, multi-DB | More abstraction |
| **Prisma** | Type-safe, migrations | Heavier, learning curve |
| **Drizzle** | Lightweight, TypeScript | Newer, less ecosystem |

*Recommendation:* **better-sqlite3** for Phase 2 simplicity, with option to add Knex.js abstraction layer for future PostgreSQL migration.

*Acceptance Criteria:*
- [ ] All existing API endpoints work without modification
- [ ] Queries are parameterized (SQL injection prevention)
- [ ] Connection pooling/management handled appropriately
- [ ] Error handling maps DB errors to appropriate HTTP responses

---

**Feature: F2.1.4 - Migration System**

*Acceptance Criteria:*
- [ ] Migrations are version-controlled in repository
- [ ] `npm run migrate` applies pending migrations
- [ ] `npm run migrate:rollback` reverts last migration
- [ ] Migration history tracked in database
- [ ] Safe to run migrations multiple times (idempotent)

---

#### Epic 2.2: Data Management

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F2.2.1 | Auto-Migration | P0 | Migrate in-memory data format to DB |
| F2.2.2 | Seed Data | P2 | Optional demo data for development |
| F2.2.3 | Backup/Restore | P1 | Export and import database |

**Feature: F2.2.1 - Auto-Migration**

*Acceptance Criteria:*
- [ ] On first run, database is created if not exists
- [ ] Schema is automatically applied
- [ ] Existing in-memory code path remains for testing
- [ ] Environment variable controls storage mode: `STORAGE_MODE=memory|sqlite`

---

**Feature: F2.2.3 - Backup/Restore**

*Acceptance Criteria:*
- [ ] `npm run backup` creates timestamped database copy
- [ ] `npm run restore <file>` restores from backup
- [ ] Backups stored in `./backups/` directory
- [ ] For SQLite: simple file copy
- [ ] Documentation for backup procedures

---

### 2.3 Technical Design

**Architecture Changes:**

```
┌─────────────────────────────────────────────────────────┐
│                     server/index.js                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  API Routes                        │  │
│  │  (No changes - same endpoints)                    │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │              Data Access Layer (NEW)               │  │
│  │  ┌─────────────────┐  ┌─────────────────────────┐ │  │
│  │  │ MemoryStorage   │  │ SQLiteStorage           │ │  │
│  │  │ (existing Maps) │  │ (new implementation)    │ │  │
│  │  └─────────────────┘  └─────────────────────────┘ │  │
│  │           ▲                      ▲                │  │
│  │           └──────────┬───────────┘                │  │
│  │                      │                            │  │
│  │              StorageInterface                     │  │
│  │  - getPeople(), createPerson(), deletePerson()   │  │
│  │  - getEvents(), createEvent(), deleteEvent()     │  │
│  │  - getConnections(), createConnection(), etc.    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**File Structure (New):**

```
server/
├── index.js              # Express app (minimal changes)
├── storage/
│   ├── index.js          # Storage factory
│   ├── interface.js      # Storage interface definition
│   ├── memory.js         # Current in-memory implementation
│   └── sqlite.js         # New SQLite implementation
├── db/
│   ├── database.sqlite   # SQLite database file (gitignored)
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── ...
└── scripts/
    ├── migrate.js
    └── backup.js
```

### 2.4 Dependencies

| Dependency | Phase 2 Requires |
|------------|------------------|
| Phase 1 | ✅ Complete |
| External | better-sqlite3 package |

### 2.5 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Backup in-memory data before switching |
| Performance regression | Medium | Benchmark before/after, add indexes |
| Schema changes break API | High | Maintain exact API contract |

---

## Phase 3: Enhanced Features

**Status:** 🔲 Planned
**Goal:** Add edit functionality, search/filter, and data export/import.

**Prerequisite:** Phase 2 (Data Persistence)

### 3.1 Overview

Phase 3 enhances the application with:
- Edit functionality for all entities (completing CRUD)
- Search and filter capabilities
- Data export to JSON
- Data import from JSON

### 3.2 Features

#### Epic 3.1: Edit Functionality

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F3.1.1 | Edit Person UI | P0 | Edit form accessible from details panel |
| F3.1.2 | Edit Event UI | P0 | Edit form accessible from details panel |
| F3.1.3 | Edit Connection UI | P1 | Edit relationship type, strength, notes |
| F3.1.4 | Inline Editing | P2 | Edit fields directly in details panel |

**Feature: F3.1.1 - Edit Person UI**

*Acceptance Criteria:*
- [ ] "Edit" button appears in person details panel
- [ ] Clicking "Edit" opens a pre-filled form with current values
- [ ] Form reuses `PersonForm` component in edit mode
- [ ] Cancel button returns to view mode without saving
- [ ] Save button calls PUT `/api/people/:id`
- [ ] Success updates graph and closes edit mode
- [ ] Validation errors shown inline

*Technical Design:*
```jsx
// PersonForm.jsx changes
function PersonForm({ onSubmit, people, events, editPerson, onCancelEdit }) {
  const isEditMode = !!editPerson;
  const [formData, setFormData] = useState(
    isEditMode ? editPerson : { /* empty defaults */ }
  );
  // ... rest of component
}
```

---

**Feature: F3.1.3 - Edit Connection UI**

*Acceptance Criteria:*
- [ ] Connections viewable when clicking a link (new interaction)
- [ ] Details panel shows connection properties
- [ ] Edit allows changing: relationshipType, strength, notes, eventId
- [ ] Cannot change `from` or `to` (would require delete + recreate)
- [ ] New PUT endpoint: `PUT /api/connections/:id`

*API Addition:*
```javascript
app.put('/api/connections/:id', (req, res) => {
  const connection = graph.connections.get(req.params.id);
  if (!connection) {
    return res.status(404).json({ error: 'Connection not found' });
  }

  const { relationshipType, strength, notes, eventId } = req.body;
  const updated = {
    ...connection,
    relationshipType: relationshipType || connection.relationshipType,
    strength: strength !== undefined ? Math.min(5, Math.max(1, parseInt(strength) || 1)) : connection.strength,
    notes: notes !== undefined ? notes : connection.notes,
    eventId: eventId !== undefined ? eventId : connection.eventId,
    updatedAt: new Date().toISOString(),
  };

  graph.connections.set(connection.id, updated);
  res.json(updated);
});
```

---

#### Epic 3.2: Search & Filter

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F3.2.1 | Global Search | P0 | Search across all entities |
| F3.2.2 | Filter by Type | P1 | Show only people or events |
| F3.2.3 | Filter by Tag | P1 | Filter people by tags |
| F3.2.4 | Filter by Date Range | P2 | Filter events by date |
| F3.2.5 | Graph Highlighting | P1 | Highlight search results in graph |

**Feature: F3.2.1 - Global Search**

*Acceptance Criteria:*
- [ ] Search input appears in header or dedicated search tab
- [ ] Search queries name, notes, tags, profession, company, location
- [ ] Results appear as filtered list below search input
- [ ] Clicking result navigates to/highlights node in graph
- [ ] Search is case-insensitive
- [ ] Debounced input (300ms) to prevent excessive queries
- [ ] Empty search shows all entities

*Technical Design:*
```javascript
// New API endpoint
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ people: [], events: [] });
  }

  const query = q.toLowerCase();

  const people = Array.from(graph.people.values()).filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.notes.toLowerCase().includes(query) ||
    p.profession.toLowerCase().includes(query) ||
    p.company.toLowerCase().includes(query) ||
    p.location.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query))
  );

  const events = Array.from(graph.events.values()).filter(e =>
    e.name.toLowerCase().includes(query) ||
    e.description.toLowerCase().includes(query) ||
    e.location.toLowerCase().includes(query)
  );

  res.json({ people, events });
});
```

---

**Feature: F3.2.5 - Graph Highlighting**

*Acceptance Criteria:*
- [ ] Search results highlighted with different color/glow in graph
- [ ] Non-matching nodes dimmed but still visible
- [ ] Clicking a search result centers graph on that node
- [ ] Clear search restores normal graph appearance

*Technical Design:*
```jsx
// GraphView.jsx additions
const [highlightedNodes, setHighlightedNodes] = useState(new Set());

nodeCanvasObject={(node, ctx, globalScale) => {
  const isHighlighted = highlightedNodes.has(node.id);
  const isDimmed = highlightedNodes.size > 0 && !isHighlighted;

  drawNode(ctx, node, globalScale, {
    highlight: isHighlighted,
    dimmed: isDimmed,
    // ... other options
  });
}}
```

---

#### Epic 3.3: Data Export/Import

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F3.3.1 | Export to JSON | P0 | Download complete graph as JSON |
| F3.3.2 | Import from JSON | P0 | Upload and merge/replace graph data |
| F3.3.3 | Export Validation | P1 | Validate exported data integrity |
| F3.3.4 | Import Conflict Resolution | P1 | Handle duplicate IDs on import |

**Feature: F3.3.1 - Export to JSON**

*Acceptance Criteria:*
- [ ] "Export" button in header or settings area
- [ ] Downloads file named `whats-next-export-{timestamp}.json`
- [ ] JSON includes: `{ people: [], events: [], connections: [], exportedAt, version }`
- [ ] All entity fields included
- [ ] Pretty-printed JSON for readability

*API Endpoint:*
```javascript
app.get('/api/export', (req, res) => {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    people: Array.from(graph.people.values()),
    events: Array.from(graph.events.values()),
    connections: Array.from(graph.connections.values()),
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition',
    `attachment; filename=whats-next-export-${Date.now()}.json`);
  res.json(data);
});
```

---

**Feature: F3.3.2 - Import from JSON**

*Acceptance Criteria:*
- [ ] "Import" button opens file picker
- [ ] Accepts `.json` files only
- [ ] Validates JSON structure before import
- [ ] User chooses: "Replace all" or "Merge with existing"
- [ ] On merge: existing entities kept, new entities added
- [ ] On merge: duplicate IDs prompt for resolution (skip/replace)
- [ ] Import success shows summary: X people, Y events, Z connections added
- [ ] Invalid data shows detailed error message

*Import Modes:*

| Mode | Behavior |
|------|----------|
| Replace | Clear all existing data, import new data |
| Merge (Skip duplicates) | Keep existing, only add new IDs |
| Merge (Replace duplicates) | Overwrite existing if ID matches |

---

### 3.3 Technical Dependencies

| Dependency | Required For |
|------------|--------------|
| Phase 2 (Persistence) | Search performance, export integrity |
| PUT connection endpoint | Edit connection feature |

### 3.4 UI/UX Considerations

**Search Placement Options:**

1. **Header search bar** - Always visible, quick access
2. **Dedicated Search tab** - More space for results, filters
3. **Graph overlay** - Search without leaving graph view

*Recommendation:* Header search bar for quick queries, with expandable advanced filters.

---

## Phase 4: User Experience

**Status:** 🔲 Planned
**Goal:** Enhance UX with timeline view, analytics, mobile support, and quality-of-life improvements.

**Prerequisite:** Phase 3 (Search capabilities)

### 4.1 Overview

Phase 4 focuses on user experience improvements:
- Timeline view for chronological exploration
- Network analytics and insights
- Mobile responsive design
- Confirmation dialogs for destructive actions
- Undo/redo functionality

### 4.2 Features

#### Epic 4.1: Timeline View

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F4.1.1 | Timeline Component | P0 | Chronological view of events and people |
| F4.1.2 | Timeline Navigation | P1 | Scroll, zoom, jump to date |
| F4.1.3 | Timeline-Graph Sync | P1 | Click timeline item to highlight in graph |

**Feature: F4.1.1 - Timeline Component**

*Acceptance Criteria:*
- [ ] New "Timeline" tab in navigation
- [ ] Events displayed on horizontal timeline by date
- [ ] People who have `eventId` shown attached to their event
- [ ] People without `eventId` shown by `createdAt` date
- [ ] Connections shown as arcs between people on timeline
- [ ] Timeline scrollable horizontally
- [ ] Zoom levels: day, week, month, year

*Technical Options:*

| Library | Pros | Cons |
|---------|------|------|
| vis-timeline | Full-featured, groups | Heavy, complex API |
| react-chrono | React-native, simple | Less customizable |
| Custom D3.js | Full control | More development effort |

---

#### Epic 4.2: Analytics & Insights

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F4.2.1 | Network Statistics | P0 | Basic metrics display |
| F4.2.2 | Most Connected People | P1 | Ranked list by connection count |
| F4.2.3 | Connection Strength Analysis | P2 | Visualize relationship strengths |
| F4.2.4 | Network Graph Metrics | P2 | Centrality, clustering coefficient |

**Feature: F4.2.1 - Network Statistics**

*Acceptance Criteria:*
- [ ] Statistics panel/tab showing key metrics
- [ ] Total people count
- [ ] Total events count
- [ ] Total connections count
- [ ] Average connections per person
- [ ] Most common relationship type
- [ ] Date range of events

*Statistics Display:*
```
┌─────────────────────────────────────┐
│         Network Statistics          │
├─────────────────────────────────────┤
│ People:          42                 │
│ Events:          12                 │
│ Connections:     67                 │
│ Avg connections: 3.2 per person     │
│ Most connected:  John Smith (8)     │
│ Top relationship: colleagues (45%)  │
│ Event span:      Jan 2024 - Dec 2024│
└─────────────────────────────────────┘
```

---

**Feature: F4.2.2 - Most Connected People**

*Acceptance Criteria:*
- [ ] Ranked list of people by connection count
- [ ] Shows top 10 by default, expandable
- [ ] Clicking a person highlights them in graph
- [ ] Shows connection count and primary relationship type

*API Endpoint:*
```javascript
app.get('/api/analytics/top-connected', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const connectionCounts = {};
  for (const conn of graph.connections.values()) {
    connectionCounts[conn.from] = (connectionCounts[conn.from] || 0) + 1;
    connectionCounts[conn.to] = (connectionCounts[conn.to] || 0) + 1;
  }

  const ranked = Object.entries(connectionCounts)
    .map(([id, count]) => ({
      person: graph.people.get(id),
      connectionCount: count
    }))
    .filter(item => item.person)
    .sort((a, b) => b.connectionCount - a.connectionCount)
    .slice(0, limit);

  res.json(ranked);
});
```

---

#### Epic 4.3: Mobile Responsive

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F4.3.1 | Responsive Layout | P0 | App usable on mobile screens |
| F4.3.2 | Touch Interactions | P1 | Touch-friendly graph manipulation |
| F4.3.3 | Mobile Navigation | P1 | Hamburger menu or bottom tabs |
| F4.3.4 | Mobile Forms | P1 | Forms optimized for mobile input |

**Feature: F4.3.1 - Responsive Layout**

*Breakpoints:*
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

*Acceptance Criteria:*
- [ ] Single-column layout on mobile
- [ ] Graph fills screen width on mobile
- [ ] Details panel slides up from bottom on mobile
- [ ] Forms scroll vertically on mobile
- [ ] Touch targets minimum 44x44px

---

#### Epic 4.4: Quality of Life

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F4.4.1 | Confirmation Dialogs | P0 | Confirm before delete |
| F4.4.2 | Undo/Redo | P2 | Undo last action |
| F4.4.3 | Keyboard Shortcuts | P2 | Power user shortcuts |
| F4.4.4 | Dark/Light Theme | P2 | Theme toggle |

**Feature: F4.4.1 - Confirmation Dialogs**

*Acceptance Criteria:*
- [ ] Delete person shows: "Delete {name}? This will also remove X connections."
- [ ] Delete event shows: "Delete {name}? References will be cleared from X people and Y connections."
- [ ] Dialog has "Cancel" and "Delete" buttons
- [ ] Delete button styled as destructive (red)
- [ ] Escape key cancels dialog
- [ ] Click outside dialog cancels

---

### 4.3 Technical Dependencies

| Dependency | Required For |
|------------|--------------|
| Phase 3 (Search) | Analytics filtering |
| All previous phases | Data to analyze |

---

## Phase 5: Multi-User & Collaboration

**Status:** 🔲 Planned
**Goal:** Transform into a multi-user application with authentication, data isolation, and sharing.

**Prerequisite:** Phase 2 (Data Persistence), Phase 4 (UX polish)

### 5.1 Overview

Phase 5 introduces:
- User authentication (signup, login, logout)
- Per-user data isolation
- Graph sharing capabilities
- Real-time collaboration (stretch goal)

### 5.2 Features

#### Epic 5.1: Authentication

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F5.1.1 | User Registration | P0 | Email/password signup |
| F5.1.2 | User Login | P0 | Email/password login |
| F5.1.3 | Session Management | P0 | JWT or session-based auth |
| F5.1.4 | Password Reset | P1 | Forgot password flow |
| F5.1.5 | OAuth Integration | P2 | Google/GitHub login |

**Feature: F5.1.1 - User Registration**

*Acceptance Criteria:*
- [ ] Registration form: email, password, confirm password, display name
- [ ] Email format validation
- [ ] Password requirements: minimum 8 characters
- [ ] Duplicate email check
- [ ] Email verification (optional for MVP)
- [ ] Auto-login after registration
- [ ] Welcome message/onboarding

*Schema Addition:*
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_login_at TEXT
);

-- Add user_id to existing tables
ALTER TABLE people ADD COLUMN user_id TEXT REFERENCES users(id);
ALTER TABLE events ADD COLUMN user_id TEXT REFERENCES users(id);
ALTER TABLE connections ADD COLUMN user_id TEXT REFERENCES users(id);

CREATE INDEX idx_people_user ON people(user_id);
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_connections_user ON connections(user_id);
```

---

**Feature: F5.1.3 - Session Management**

*Technology Options:*

| Option | Pros | Cons |
|--------|------|------|
| JWT (stateless) | Scalable, no session storage | Revocation complexity |
| Session cookies | Simple, easy revocation | Server state required |
| JWT + Refresh tokens | Balance of both | More complexity |

*Recommendation:* JWT with short expiry (1 hour) + refresh tokens for Phase 5 MVP.

*Acceptance Criteria:*
- [ ] Login returns JWT access token
- [ ] Token included in Authorization header for API requests
- [ ] Token expiry handled gracefully (redirect to login)
- [ ] Logout invalidates refresh token
- [ ] Protected routes return 401 if unauthorized

---

#### Epic 5.2: Data Isolation

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F5.2.1 | User-Scoped Queries | P0 | All queries filtered by user |
| F5.2.2 | Data Migration | P0 | Associate existing data with first user |
| F5.2.3 | User Deletion | P1 | Delete account and all data |

**Feature: F5.2.1 - User-Scoped Queries**

*Acceptance Criteria:*
- [ ] `GET /api/graph` returns only current user's data
- [ ] `POST /api/people` automatically assigns current user
- [ ] Cannot access/modify other users' data
- [ ] API returns 404 (not 403) for other users' resources (information hiding)

*Implementation Pattern:*
```javascript
// Middleware to extract user from JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Apply to all routes
app.use('/api', authenticateToken);

// Scoped query example
app.get('/api/people', (req, res) => {
  const people = db.prepare(
    'SELECT * FROM people WHERE user_id = ?'
  ).all(req.user.id);
  res.json(people);
});
```

---

#### Epic 5.3: Sharing

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F5.3.1 | Public Link Sharing | P1 | Generate shareable read-only link |
| F5.3.2 | Embed View | P2 | Embeddable graph widget |
| F5.3.3 | Collaborative Editing | P2 | Invite others to edit |

**Feature: F5.3.1 - Public Link Sharing**

*Acceptance Criteria:*
- [ ] "Share" button in header
- [ ] Generates unique public URL: `/shared/{shareId}`
- [ ] Public view is read-only (no edit/delete buttons)
- [ ] Owner can revoke/regenerate share link
- [ ] Share settings: public (anyone with link) or private (disabled)
- [ ] Shared view shows owner attribution

*Schema Addition:*
```sql
CREATE TABLE share_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    share_token TEXT UNIQUE NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    last_accessed_at TEXT
);
```

---

#### Epic 5.4: Security Hardening

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F5.4.1 | CORS Restriction | P0 | Restrict to known origins |
| F5.4.2 | Rate Limiting | P0 | Prevent API abuse |
| F5.4.3 | Input Sanitization | P0 | Prevent XSS, SQL injection |
| F5.4.4 | HTTPS Enforcement | P0 | TLS for all connections |

**Feature: F5.4.2 - Rate Limiting**

*Acceptance Criteria:*
- [ ] Rate limit: 100 requests per minute per IP
- [ ] Rate limit: 1000 requests per hour per user
- [ ] 429 response when limit exceeded
- [ ] Rate limit headers in responses
- [ ] Configurable limits via environment variables

---

### 5.3 Technical Dependencies

| Dependency | Required For |
|------------|--------------|
| Phase 2 (Persistence) | User data storage |
| Environment config | JWT secrets, email service |
| HTTPS | Secure authentication |

### 5.4 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Password security | High | Use bcrypt, enforce strong passwords |
| Token theft | High | Short expiry, refresh token rotation |
| Data leakage | High | Thorough query scoping, security review |
| Account enumeration | Medium | Generic error messages |

---

## Phase 6: Telegram Integration

**Status:** 🔲 Planned
**Goal:** Enable adding people to the knowledge graph via Telegram bot for quick, on-the-go contact capture.

**Prerequisites:** Phase 2 (Data Persistence), Phase 5 (Multi-User) recommended

### 6.1 Overview

Phase 6 introduces a Telegram bot that allows users to:
- Quickly add new contacts while networking (conferences, events, meetups)
- Capture basic information without opening the web app
- Automatically link new contacts to the user's knowledge graph

This is a **secondary input channel** - the web UI remains the primary interface for graph exploration and management, while Telegram serves as a quick-capture tool.

### 6.2 Features

#### Epic 6.1: Telegram Bot Setup

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F6.1.1 | Bot Registration | P0 | Create and configure Telegram bot |
| F6.1.2 | Webhook Infrastructure | P0 | Receive and process Telegram messages |
| F6.1.3 | User Linking | P0 | Link Telegram account to app account |

**Feature: F6.1.1 - Bot Registration**

*Setup Steps:*
1. Create bot via @BotFather on Telegram
2. Obtain bot token
3. Configure bot name, description, commands
4. Store token securely in environment variables

*Bot Commands to Register:*
```
add - Add a new person to your graph
connect - Create connection between people
recent - Show recently added people
help - Show available commands
link - Link your Telegram to your account
```

*Acceptance Criteria:*
- [ ] Bot registered with descriptive name (e.g., @WhatsNextGraphBot)
- [ ] Bot token stored in `TELEGRAM_BOT_TOKEN` env var
- [ ] Bot responds to /start with welcome message
- [ ] Bot commands registered with BotFather

---

**Feature: F6.1.2 - Webhook Infrastructure**

*Architecture:*
```
Telegram Servers
       │
       │ HTTPS POST (webhook)
       ▼
┌─────────────────────────────────┐
│     /api/telegram/webhook       │
│  ┌───────────────────────────┐  │
│  │   Message Parser          │  │
│  │   - Extract command       │  │
│  │   - Parse arguments       │  │
│  └─────────────┬─────────────┘  │
│                │                │
│  ┌─────────────▼─────────────┐  │
│  │   Command Handler         │  │
│  │   - /add → addPerson()    │  │
│  │   - /connect → addConn()  │  │
│  └─────────────┬─────────────┘  │
│                │                │
│  ┌─────────────▼─────────────┐  │
│  │   Response Formatter      │  │
│  │   - Success/error msgs    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
       │
       │ Reply
       ▼
    Telegram User
```

*Acceptance Criteria:*
- [ ] Webhook endpoint at `POST /api/telegram/webhook`
- [ ] Webhook URL registered with Telegram API
- [ ] Webhook validates Telegram signature (security)
- [ ] Messages processed asynchronously (quick 200 response)
- [ ] Error handling doesn't crash server

*Technical Implementation:*
```javascript
// server/telegram/webhook.js
const express = require('express');
const router = express.Router();
const { handleTelegramUpdate } = require('./handlers');

router.post('/webhook', async (req, res) => {
  // Respond immediately (Telegram expects fast response)
  res.sendStatus(200);

  // Process update asynchronously
  try {
    await handleTelegramUpdate(req.body);
  } catch (error) {
    console.error('Telegram webhook error:', error);
  }
});

module.exports = router;
```

---

**Feature: F6.1.3 - User Linking**

*Flow:*
1. User sends `/link` command to bot
2. Bot generates unique 6-digit code (expires in 10 minutes)
3. User enters code in web app settings
4. System links Telegram chat ID to user account
5. Future messages from that chat ID are associated with user

*Acceptance Criteria:*
- [ ] `/link` command generates time-limited code
- [ ] Web UI has "Link Telegram" section in settings
- [ ] Code validation links Telegram chat_id to user_id
- [ ] User can unlink Telegram account
- [ ] One Telegram account = one app account (no sharing)

*Schema Addition:*
```sql
-- Add to users table (Phase 5)
ALTER TABLE users ADD COLUMN telegram_chat_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN telegram_linked_at TEXT;

-- Temporary link codes
CREATE TABLE telegram_link_codes (
    code TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
```

---

#### Epic 6.2: Quick Add Commands

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F6.2.1 | Add Person Command | P0 | `/add Name - notes` creates person |
| F6.2.2 | Conversational Add | P1 | Bot asks follow-up questions |
| F6.2.3 | Add from Contact | P2 | Forward Telegram contact to add |
| F6.2.4 | Add Connection Command | P1 | `/connect Person1, Person2` |

**Feature: F6.2.1 - Add Person Command**

*Command Format:*
```
/add John Smith
/add John Smith - met at TechConf, works at Google
/add John Smith | Software Engineer @ Google | met at TechConf
```

*Parsing Rules:*
- First part: Name (required)
- After `-` or `|`: Notes/context (optional)
- Keywords parsed: `@` for company, common titles for profession

*Acceptance Criteria:*
- [ ] `/add Name` creates person with just name
- [ ] `/add Name - notes` creates person with notes
- [ ] Bot confirms creation with person details
- [ ] Bot shows link to view person in web app
- [ ] Invalid format shows usage help
- [ ] Person automatically linked to current user (multi-user mode)

*Response Format:*
```
✅ Added to your graph:

John Smith
📝 met at TechConf, works at Google

[View in app](https://yourapp.com/person/uuid)

Quick actions:
/connect John Smith, [other person]
```

---

**Feature: F6.2.2 - Conversational Add**

*Flow:*
```
User: /add
Bot:  What's their name?
User: Sarah Chen
Bot:  Got it! Any notes? (profession, where you met, etc.)
      Send "skip" to add without notes.
User: Product Manager at Stripe, met at FinTech meetup
Bot:  ✅ Added Sarah Chen to your graph!
      📝 Product Manager at Stripe, met at FinTech meetup
```

*Acceptance Criteria:*
- [ ] `/add` without arguments starts conversation
- [ ] Bot tracks conversation state per chat
- [ ] "skip" or "done" completes with current info
- [ ] Conversation times out after 5 minutes
- [ ] User can cancel with /cancel

*State Management:*
```javascript
// In-memory conversation state (or Redis for production)
const conversationState = new Map();

// State structure
{
  chatId: {
    command: 'add',
    step: 'awaiting_name' | 'awaiting_notes',
    data: { name: '', notes: '' },
    expiresAt: Date
  }
}
```

---

**Feature: F6.2.3 - Add from Contact**

*Flow:*
1. User forwards a Telegram contact to the bot
2. Bot extracts: name, phone number
3. Bot creates person with extracted info
4. Bot asks for additional notes (optional)

*Acceptance Criteria:*
- [ ] Bot recognizes forwarded contact messages
- [ ] Extracts first_name, last_name, phone_number
- [ ] Creates person with available fields
- [ ] Prompts for optional notes
- [ ] Handles contacts without phone numbers gracefully

---

**Feature: F6.2.4 - Add Connection Command**

*Command Format:*
```
/connect John Smith, Sarah Chen
/connect John, Sarah - colleagues from Google
```

*Acceptance Criteria:*
- [ ] Parses two names separated by comma
- [ ] Fuzzy matches names against existing people
- [ ] If ambiguous, shows options to select
- [ ] Creates connection with default type "knows"
- [ ] Optional notes after `-`
- [ ] Error if either person not found

*Fuzzy Matching:*
```javascript
// Find person by partial name match
function findPersonByName(query, userId) {
  const people = getPeopleForUser(userId);
  const queryLower = query.toLowerCase().trim();

  // Exact match first
  const exact = people.find(p =>
    p.name.toLowerCase() === queryLower
  );
  if (exact) return [exact];

  // Partial matches
  const partial = people.filter(p =>
    p.name.toLowerCase().includes(queryLower)
  );

  return partial;
}
```

---

#### Epic 6.3: Query Commands

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F6.3.1 | Recent Additions | P1 | `/recent` shows last 5 people added |
| F6.3.2 | Search | P2 | `/search query` finds people |
| F6.3.3 | Stats | P2 | `/stats` shows graph statistics |

**Feature: F6.3.1 - Recent Additions**

*Acceptance Criteria:*
- [ ] `/recent` shows last 5 people added
- [ ] `/recent 10` shows last 10
- [ ] Shows name, date added, truncated notes
- [ ] Each entry has quick link to web view

*Response Format:*
```
📋 Recently added:

1. Sarah Chen (2 hours ago)
   Product Manager at Stripe

2. John Smith (yesterday)
   met at TechConf

3. Alex Kim (3 days ago)
   Investor, intro from Mike

[View all in app](https://yourapp.com/people)
```

---

### 6.3 Technical Design

**File Structure:**
```
server/
├── index.js
├── telegram/
│   ├── index.js          # Router setup
│   ├── webhook.js        # Webhook endpoint
│   ├── handlers.js       # Command handlers
│   ├── commands/
│   │   ├── add.js        # /add command logic
│   │   ├── connect.js    # /connect command logic
│   │   ├── recent.js     # /recent command logic
│   │   └── link.js       # /link command logic
│   ├── conversation.js   # Conversation state management
│   └── api.js            # Telegram API helpers (sendMessage, etc.)
└── ...
```

**Dependencies:**
```json
{
  "node-telegram-bot-api": "^0.64.0"
  // OR use raw HTTPS for lighter weight
}
```

**Environment Variables:**
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_SECRET=random_secret_for_validation
APP_URL=https://yourapp.com  # For generating links
```

### 6.4 Dependencies

| Dependency | Required For |
|------------|--------------|
| Phase 2 (Persistence) | Storing Telegram-added people |
| Phase 5 (Multi-User) | User linking, data isolation |
| HTTPS/Public URL | Telegram webhook requirement |
| Telegram Bot Token | Bot API access |

### 6.5 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Webhook security | High | Validate Telegram signatures |
| Spam/abuse | Medium | Rate limiting per chat ID |
| Name ambiguity | Low | Show options when multiple matches |
| State management complexity | Medium | Keep conversations simple, use timeouts |

### 6.6 Future Extensions (Post-Phase 6)

- **Voice messages**: Transcribe voice notes to add people
- **Photo OCR**: Extract info from business card photos
- **Location tagging**: Attach current location to new contacts
- **Event creation**: `/event Conference Name` to create events
- **Daily digest**: Bot sends summary of recent graph activity

---

## Phase Dependencies

```
Phase 1 (Core MVP) ────────────────────────────────────────┐
     ✅ Complete                                            │
         │                                                  │
         ▼                                                  │
Phase 2 (Data Persistence) ────────────────────────────────┤
     Required for all subsequent phases                     │
         │                                                  │
         ├─────────────────────────┐                       │
         ▼                         ▼                        │
Phase 3 (Enhanced)           Phase 5 (Multi-User)          │
  Edit, Search, Export         Auth, Isolation              │
         │                         │                        │
         ▼                         ▼                        │
Phase 4 (UX)               Phase 6 (Telegram)              │
  Timeline, Analytics        Bot, Quick-add                 │
  Mobile, QoL                Commands                       │
         │                         │                        │
         └─────────────────────────┴────────────────────────┘
                                   │
                              Production
                               Ready
```

**Critical Path:** Phase 1 → Phase 2 → Phase 5 → Phase 6 (for full Telegram integration)

**Parallel Paths:** Phase 3 and Phase 4 can be developed in parallel after Phase 2

---

## Technical Debt & Maintenance

### Ongoing Maintenance Tasks

| Task | Frequency | Description |
|------|-----------|-------------|
| Dependency updates | Monthly | Update npm packages, security patches |
| Database backups | Daily (Phase 2+) | Automated backup scripts |
| Log rotation | Weekly | Manage server logs |
| Performance monitoring | Ongoing | Track API response times |

### Known Technical Debt

| Item | Phase Introduced | Resolution Phase |
|------|------------------|------------------|
| Wide-open CORS | Phase 1 | Phase 5 |
| No input sanitization beyond React | Phase 1 | Phase 5 |
| Alert() for client validation | Phase 1 | Phase 3 |
| No loading states for API calls | Phase 1 | Phase 4 |
| Hard-coded API URL | Phase 1 | Phase 2 |

### Code Quality Standards

All phases should maintain:
- ESLint passing (frontend)
- No console.log in production code
- Consistent error handling patterns
- API documentation updated with changes
- Unit tests for new backend logic (Phase 2+)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial implementation phases document |

---

*This document serves as the implementation roadmap for the What's Next knowledge graph application. Phase priorities and details may be adjusted based on user feedback and resource availability.*
