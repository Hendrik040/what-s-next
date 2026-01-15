# Product Requirements Document (PRD)
# What's Next - Knowledge Graph Application

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Implementation Complete (v1.0)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [User Personas & Use Cases](#3-user-personas--use-cases)
4. [Functional Requirements](#4-functional-requirements)
5. [Data Model](#5-data-model)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [UI/UX Specifications](#8-uiux-specifications)
9. [Out of Scope (v1.0)](#9-out-of-scope-v10)
10. [Future Roadmap](#10-future-roadmap)
11. [Assumptions & Risks](#11-assumptions--risks)
12. [Appendix: API Reference](#12-appendix-api-reference)

---

## 1. Executive Summary

### 1.1 Problem Statement

Professionals, networkers, and individuals who attend events, conferences, and social gatherings often struggle to:
- Remember who they met and the context of those meetings
- Track relationships and connection strengths between contacts
- Visualize their professional and personal networks
- Recall how different people in their network are interconnected

Traditional contact management tools (spreadsheets, phone contacts, CRMs) fail to capture the **relational context** between people and the events where connections formed.

### 1.2 Solution Overview

**What's Next** is a knowledge graph application that enables users to:
- Track people they've met with rich contextual information
- Record events and associate people with those events
- Create explicit connections between people with relationship metadata
- Visualize their entire network as an interactive force-directed graph

### 1.3 Target Users

- Professionals who network frequently (sales, recruiting, consulting)
- Event organizers and community builders
- Individuals who want to maintain meaningful relationships
- Anyone building and managing a personal or professional network

### 1.4 Key Differentiator

Unlike traditional contact management, What's Next treats relationships as **first-class entities** with their own properties (type, strength, context), enabling users to see not just *who* they know, but *how* they're all connected.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

Empower users to build, visualize, and leverage their personal and professional networks through intuitive relationship mapping and graph-based exploration.

### 2.2 Goals

| Goal ID | Goal | Success Criteria |
|---------|------|------------------|
| G-001 | Enable comprehensive contact management | Users can create people with 9+ fields of information |
| G-002 | Support event-based context | Users can create events and associate people/connections with them |
| G-003 | Model explicit relationships | Users can create connections with type, strength, and notes |
| G-004 | Provide visual network exploration | Users can view and interact with a force-directed graph |
| G-005 | Deliver intuitive user experience | Users can perform all CRUD operations without documentation |

### 2.3 Success Metrics

For a portfolio/demo context:
- **Functionality Coverage:** All CRUD operations for People, Events, and Connections work correctly
- **Visualization Quality:** Graph renders correctly with distinguishable node types and interactive features
- **Code Quality:** Clean architecture with separation of concerns between frontend and backend
- **Error Handling:** Graceful handling of validation errors and edge cases

---

## 3. User Personas & Use Cases

### 3.1 Primary Persona: "The Networker"

**Name:** Alex Chen
**Role:** Business Development Manager
**Goals:**
- Track contacts from conferences and networking events
- Remember context of how/where people were met
- Understand second-degree connections (who knows whom)
- Quickly recall relationship details before follow-up meetings

**Pain Points:**
- Business cards pile up with no system to organize them
- Forgets how people are connected to each other
- LinkedIn doesn't capture personal relationship notes
- Existing CRMs are too heavy for personal networking

### 3.2 Use Cases

#### UC-001: Add a New Contact After an Event

**Actor:** User
**Precondition:** User has created the event in the system
**Flow:**
1. User navigates to "Add Person" tab
2. User enters contact details (name, email, phone, profession, company, location)
3. User selects the event where they met this person
4. User adds personal notes and tags
5. User submits the form
6. System creates the person and displays confirmation

**Postcondition:** Person appears in the graph and person list

---

#### UC-002: Create a Connection Between Two People

**Actor:** User
**Precondition:** At least two people exist in the system
**Flow:**
1. User navigates to "Add Connection" tab
2. User selects Person 1 and Person 2 from dropdowns
3. User selects relationship type (knows, friends, colleagues, family, met)
4. User adjusts connection strength (1-5 slider)
5. User optionally selects the event where the connection formed
6. User adds notes about the relationship
7. User submits the form
8. System validates and creates the connection

**Postcondition:** A link appears between the two people in the graph view

---

#### UC-003: Explore the Network Graph

**Actor:** User
**Precondition:** At least one person or event exists
**Flow:**
1. User views the Graph View tab
2. User sees force-directed graph with nodes (people=green, events=blue)
3. User drags nodes to rearrange the layout
4. User clicks a node to view detailed information panel
5. User reviews displayed properties (profession, company, notes, tags, etc.)
6. User optionally deletes the node from the details panel

**Postcondition:** User has explored and optionally modified the graph

---

#### UC-004: Delete a Person and Their Connections

**Actor:** User
**Precondition:** Person exists with one or more connections
**Flow:**
1. User clicks on a person node in the graph
2. User views the details panel
3. User clicks "Delete person" button
4. System deletes the person AND all associated connections (cascade delete)
5. Graph updates to reflect the removal

**Postcondition:** Person and all their connections are removed from the system

---

## 4. Functional Requirements

### 4.1 People Management

#### REQ-P001: Create Person
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-P001 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can create a new person record with contact and contextual information |

**Acceptance Criteria:**
- [ ] Form accepts: name (required), email, phone, profession, company, location, notes, tags, eventId
- [ ] Name field is required; form shows validation error if empty
- [ ] Tags are entered as comma-separated values and stored as array
- [ ] EventId dropdown shows all existing events with name and date
- [ ] On successful creation, form resets to empty state
- [ ] New person immediately appears in graph view and person list
- [ ] Person receives a unique UUID identifier

---

#### REQ-P002: View People List
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-P002 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can view a list of all people in the system |

**Acceptance Criteria:**
- [ ] List displays below the "Add Person" form
- [ ] Each person shows: name (bold), profession, company (with @), location (in parentheses)
- [ ] List shows count of total people
- [ ] List updates immediately when people are added or deleted

---

#### REQ-P003: View Person Details
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-P003 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can view detailed information about a person by clicking their node |

**Acceptance Criteria:**
- [ ] Clicking a person node in the graph opens a details panel
- [ ] Panel displays: name, type ("person"), profession, company, location, email, phone, notes
- [ ] Tags display as styled chips/badges
- [ ] Panel includes close button (×) to dismiss
- [ ] Panel includes delete button

---

#### REQ-P004: Delete Person
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-P004 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can delete a person from the system |

**Acceptance Criteria:**
- [ ] Delete button available in person details panel
- [ ] Deleting a person removes them from the people list
- [ ] Deleting a person removes their node from the graph
- [ ] **Cascade behavior:** All connections involving this person are automatically deleted
- [ ] Graph updates immediately without page refresh

---

### 4.2 Event Management

#### REQ-E001: Create Event
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-E001 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can create a new event record |

**Acceptance Criteria:**
- [ ] Form accepts: name (required), date (datetime-local picker), location, description
- [ ] Name field is required; form shows validation error if empty
- [ ] If no date provided, defaults to current timestamp
- [ ] On successful creation, form resets to empty state
- [ ] New event immediately appears in graph view and event list
- [ ] Event receives a unique UUID identifier

---

#### REQ-E002: View Events List
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-E002 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can view a list of all events in the system |

**Acceptance Criteria:**
- [ ] List displays below the "Add Event" form
- [ ] Each event shows: name (bold), location (with dash), date (formatted)
- [ ] List shows count of total events
- [ ] List updates immediately when events are added or deleted

---

#### REQ-E003: View Event Details
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-E003 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can view detailed information about an event by clicking its node |

**Acceptance Criteria:**
- [ ] Clicking an event node in the graph opens a details panel
- [ ] Panel displays: name, type ("event"), date (formatted), location, description
- [ ] Panel includes close button (×) to dismiss
- [ ] Panel includes delete button

---

#### REQ-E004: Delete Event
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-E004 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can delete an event from the system |

**Acceptance Criteria:**
- [ ] Delete button available in event details panel
- [ ] Deleting an event removes it from the events list
- [ ] Deleting an event removes its node from the graph
- [ ] **Cascade behavior:** EventId references in people and connections are set to null
- [ ] Graph updates immediately without page refresh

---

### 4.3 Connection Management

#### REQ-C001: Create Connection
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-C001 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can create a connection between two people |

**Acceptance Criteria:**
- [ ] Form requires at least 2 people to exist (shows message otherwise)
- [ ] Form accepts: from (required), to (required), relationshipType, strength (1-5), notes, eventId
- [ ] Dropdowns populate with all existing people
- [ ] Relationship types: knows (default), friends, colleagues, family, met
- [ ] Strength is a slider from 1-5, displayed numerically
- [ ] EventId dropdown shows all existing events
- [ ] **Validation:** Cannot create self-connections (from === to)
- [ ] **Validation:** Cannot create duplicate connections between same two people
- [ ] **Bidirectional key:** Connection A→B and B→A are treated as the same connection
- [ ] On successful creation, form resets to default state
- [ ] New connection immediately appears as a link in the graph

---

#### REQ-C002: Delete Connection
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-C002 |
| **Priority** | P1 (Should Have) |
| **Status** | ⚠️ Partial (API exists, no UI trigger) |
| **Description** | Users can delete a connection between two people |

**Acceptance Criteria:**
- [ ] DELETE endpoint exists at `/api/connections/:id`
- [ ] Connection ID is the deterministic key (sorted IDs joined with underscore)
- [ ] Deletion removes the link from the graph
- [ ] ⚠️ Note: No UI button currently triggers this; deletion only via cascade

---

### 4.4 Graph Visualization

#### REQ-G001: Render Force-Directed Graph
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-G001 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | System displays an interactive force-directed graph of all entities |

**Acceptance Criteria:**
- [ ] Graph renders using react-force-graph-2d library
- [ ] People nodes are green (#4CAF50)
- [ ] Event nodes are blue (#2196F3)
- [ ] Connections appear as links between nodes
- [ ] Graph uses canvas rendering (not SVG)
- [ ] Graph is responsive to container size
- [ ] Empty state shows message prompting user to add data

---

#### REQ-G002: Interactive Node Manipulation
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-G002 |
| **Priority** | P0 (Must Have) |
| **Status** | ✅ Implemented |
| **Description** | Users can interact with graph nodes |

**Acceptance Criteria:**
- [ ] Nodes can be dragged to new positions
- [ ] Hovering over a node shows the name as tooltip
- [ ] Clicking a node opens the details panel
- [ ] Graph physics simulation stabilizes over time (velocity decay: 0.3)
- [ ] Links have directional arrows
- [ ] Links have slight curvature (0.1) for visual clarity

---

#### REQ-G003: Graph Legend
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-G003 |
| **Priority** | P1 (Should Have) |
| **Status** | ✅ Implemented |
| **Description** | Graph displays a legend explaining node colors |

**Acceptance Criteria:**
- [ ] Legend appears in fixed position on the graph view
- [ ] Legend shows green circle with "People" label
- [ ] Legend shows blue circle with "Events" label

---

### 4.5 Error Handling

#### REQ-ERR001: Display API Errors
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-ERR001 |
| **Priority** | P1 (Should Have) |
| **Status** | ✅ Implemented |
| **Description** | System displays user-friendly error messages for API failures |

**Acceptance Criteria:**
- [ ] Error banner appears at top of screen when API call fails
- [ ] Banner displays error message from API response
- [ ] Banner includes close button (×) to dismiss manually
- [ ] Banner auto-dismisses after 5 seconds
- [ ] Validation errors (400) show specific field errors
- [ ] Not found errors (404) are handled gracefully

---

## 5. Data Model

### 5.1 Entity: Person

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | UUID (string) | Auto | Generated | Unique identifier |
| `type` | string | Auto | "person" | Entity type discriminator |
| `name` | string | ✅ Yes | - | Person's full name |
| `email` | string | No | "" | Email address |
| `phone` | string | No | "" | Phone number |
| `profession` | string | No | "" | Job title or profession |
| `company` | string | No | "" | Current company/organization |
| `location` | string | No | "" | City, region, or address |
| `notes` | string | No | "" | Free-form notes |
| `tags` | string[] | No | [] | Categorization tags |
| `eventId` | UUID (string) | No | null | Event where person was met |
| `createdAt` | ISO timestamp | Auto | Now | Creation timestamp |
| `updatedAt` | ISO timestamp | Auto | - | Last update timestamp |

### 5.2 Entity: Event

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | UUID (string) | Auto | Generated | Unique identifier |
| `type` | string | Auto | "event" | Entity type discriminator |
| `name` | string | ✅ Yes | - | Event name/title |
| `date` | ISO timestamp | No | Now | Event date and time |
| `location` | string | No | "" | Event venue/location |
| `description` | string | No | "" | Event description |
| `attendees` | UUID[] | No | [] | List of attending person IDs |
| `createdAt` | ISO timestamp | Auto | Now | Creation timestamp |
| `updatedAt` | ISO timestamp | Auto | - | Last update timestamp |

### 5.3 Entity: Connection

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Auto | Generated | Deterministic key: sorted(from, to).join('_') |
| `from` | UUID (string) | ✅ Yes | - | First person's ID |
| `to` | UUID (string) | ✅ Yes | - | Second person's ID |
| `relationshipType` | enum | No | "knows" | Type of relationship |
| `strength` | integer (1-5) | No | 1 | Connection strength |
| `notes` | string | No | "" | Relationship notes |
| `eventId` | UUID (string) | No | null | Event where connection formed |
| `createdAt` | ISO timestamp | Auto | Now | Creation timestamp |

**Relationship Types (enum):**
- `knows` - General acquaintance
- `friends` - Personal friendship
- `colleagues` - Professional relationship
- `family` - Family relationship
- `met` - Recently met / initial contact

### 5.4 Entity Relationships

```
┌─────────────┐         ┌─────────────┐
│   Person    │◄───────►│   Person    │
└──────┬──────┘   via   └──────┬──────┘
       │       Connection      │
       │                       │
       │ eventId (optional)    │ eventId (optional)
       │                       │
       ▼                       ▼
┌──────────────────────────────────────┐
│                Event                 │
└──────────────────────────────────────┘
```

### 5.5 Data Integrity Rules

| Rule | Description |
|------|-------------|
| **Connection Bidirectionality** | Connections are undirected. The `connectionKey()` function sorts IDs alphabetically, ensuring A→B and B→A resolve to the same key. |
| **Self-Connection Prevention** | API rejects connections where `from === to` |
| **Duplicate Prevention** | API rejects connections if one already exists between the two people (409 Conflict) |
| **Referential Integrity (Soft)** | Deleting a person cascades to delete all their connections |
| **Referential Integrity (Soft)** | Deleting an event sets `eventId` to null on referencing people and connections |
| **Foreign Key Validation** | Creating a connection validates both `from` and `to` person IDs exist |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P001 | Initial page load | < 2 seconds on broadband |
| NFR-P002 | Graph rendering | Smooth at 50+ nodes |
| NFR-P003 | API response time | < 200ms for CRUD operations |
| NFR-P004 | Real-time updates | Graph reflects changes within 500ms |

### 6.2 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 90+ | Supported |
| Firefox | 88+ | Supported |
| Safari | 14+ | Supported |
| Edge | 90+ | Supported |

### 6.3 Accessibility

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-A001 | Form labels associated with inputs | ✅ Implemented |
| NFR-A002 | Keyboard navigation for forms | ✅ Implemented |
| NFR-A003 | Color contrast ratios (WCAG AA) | ⚠️ Partial |
| NFR-A004 | Screen reader support for graph | ❌ Not Implemented |

### 6.4 Security

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-S001 | Input sanitization | ⚠️ Basic (relies on React's XSS protection) |
| NFR-S002 | CORS configuration | ⚠️ Wide open (not production-safe) |
| NFR-S003 | Authentication | ❌ Not Implemented (single-user demo) |
| NFR-S004 | HTTPS | ❌ Not Implemented (localhost only) |

---

## 7. Technical Architecture

### 7.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    React 19 + Vite                   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐ │   │
│  │  │ Graph   │ │ Person  │ │ Event   │ │Connection │ │   │
│  │  │ View    │ │ Form    │ │ Form    │ │  Form     │ │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └─────┬─────┘ │   │
│  │       │           │           │             │       │   │
│  │       └───────────┴─────┬─────┴─────────────┘       │   │
│  │                         │                           │   │
│  │                    ┌────▼────┐                      │   │
│  │                    │ App.jsx │ (State Management)   │   │
│  │                    └────┬────┘                      │   │
│  │                         │ Axios                     │   │
│  └─────────────────────────┼───────────────────────────┘   │
│                            │                               │
│                       Port 5173                            │
└────────────────────────────┼───────────────────────────────┘
                             │ HTTP/REST
                             │
┌────────────────────────────┼───────────────────────────────┐
│                       Port 3001                            │
│  ┌─────────────────────────▼───────────────────────────┐   │
│  │                  Express.js Server                   │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │              REST API Routes                 │    │   │
│  │  │  /api/graph  /api/people  /api/events       │    │   │
│  │  │              /api/connections               │    │   │
│  │  └────────────────────┬────────────────────────┘    │   │
│  │                       │                             │   │
│  │  ┌────────────────────▼────────────────────────┐    │   │
│  │  │           In-Memory Storage                  │    │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │    │   │
│  │  │  │ people   │ │ events   │ │ connections │  │    │   │
│  │  │  │  (Map)   │ │  (Map)   │ │    (Map)    │  │    │   │
│  │  │  └──────────┘ └──────────┘ └─────────────┘  │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                         SERVER                             │
└────────────────────────────────────────────────────────────┘
```

### 7.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend Framework** | React | 19.x | UI components and state management |
| **Build Tool** | Vite | 6.x | Development server and bundling |
| **Graph Library** | react-force-graph-2d | Latest | Force-directed graph visualization |
| **HTTP Client** | Axios | Latest | API communication |
| **Backend Framework** | Express.js | 4.x | REST API server |
| **Runtime** | Node.js | 14+ | Server runtime |
| **ID Generation** | uuid | 4.x | UUID v4 generation |
| **Middleware** | cors, body-parser | Latest | Request handling |

### 7.3 Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| **In-memory storage** | Simplifies demo/course setup; no database configuration required |
| **React state in App.jsx** | Centralized state management without Redux complexity for small app |
| **Canvas-based graph** | Better performance than SVG for larger graphs |
| **Bidirectional connection keys** | Prevents duplicate connections regardless of direction |
| **Cascade deletion** | Maintains referential integrity without orphaned connections |
| **UUID for entity IDs** | Globally unique, no collision concerns |

---

## 8. UI/UX Specifications

### 8.1 Screen: Graph View (Default)

**Purpose:** Visualize the knowledge graph and explore node details

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER                                    │
│    "What's Next - Knowledge Graph"                          │
│    "Track people and events with connections"               │
├─────────────────────────────────────────────────────────────┤
│  [Graph View] [Add Person] [Add Event] [Add Connection]     │
├─────────────────────────────────────────────────────────────┤
│                                              ┌────────────┐ │
│                                              │  DETAILS   │ │
│              GRAPH CANVAS                    │   PANEL    │ │
│                                              │ (on click) │ │
│    ○ Person (green)                          │            │ │
│    ○ Event (blue)                            │  Name      │ │
│    — Connection (link)                       │  Type      │ │
│                                              │  Fields... │ │
│                                              │            │ │
│                                              │ [Delete]   │ │
│  ┌────────────┐                              └────────────┘ │
│  │  LEGEND    │                                             │
│  │ ● People   │                                             │
│  │ ● Events   │                                             │
│  └────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Drag nodes to reposition
- Click node to open details panel
- Click × or outside panel to close
- Scroll/pinch to zoom (library default)

**Empty State:**
- Centered message: "Your Knowledge Graph is Empty"
- Subtext: "Start by adding people and events using the tabs above!"

---

### 8.2 Screen: Add Person

**Purpose:** Create new person records

**Form Fields:**
1. Name * (text input, required)
2. Email (email input)
3. Phone (tel input)
4. Profession (text input)
5. Company (text input)
6. Location (text input)
7. Met at Event (dropdown of events)
8. Notes (textarea, 4 rows)
9. Tags (text input, comma-separated)

**Below Form:** List of existing people with count

---

### 8.3 Screen: Add Event

**Purpose:** Create new event records

**Form Fields:**
1. Event Name * (text input, required)
2. Date (datetime-local picker)
3. Location (text input)
4. Description (textarea, 4 rows)

**Below Form:** List of existing events with count

---

### 8.4 Screen: Add Connection

**Purpose:** Create connections between people

**Form Fields:**
1. Person 1 * (dropdown, required)
2. Person 2 * (dropdown, required)
3. Relationship Type (dropdown: knows, friends, colleagues, family, met)
4. Connection Strength (range slider 1-5, with numeric display)
5. Met at Event (dropdown of events)
6. Notes (textarea, 3 rows)

**Conditional State:**
- If < 2 people exist: Show message "You need at least 2 people to create a connection"

---

### 8.5 Visual Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | #4CAF50 | People nodes, success states |
| Secondary Color | #2196F3 | Event nodes, links |
| Background | #1a1a1a | App background (dark theme) |
| Surface | #2d2d2d | Cards, panels |
| Text Primary | #ffffff | Primary text |
| Text Secondary | #a0a0a0 | Secondary text |
| Error | #f44336 | Error states, delete buttons |
| Border Radius | 8px | Buttons, cards |

---

## 9. Out of Scope (v1.0)

The following features are explicitly **not included** in version 1.0:

| Feature | Reason |
|---------|--------|
| **Edit functionality in UI** | Focus on core CRUD; PUT endpoints exist but not wired to UI |
| **Data persistence** | Demo/course format; intentionally in-memory |
| **User authentication** | Single-user demo application |
| **Search and filtering** | Future enhancement |
| **Export/import data** | Future enhancement |
| **Mobile responsive design** | Desktop-first for demo |
| **Real-time collaboration** | Single-user application |
| **Connection editing** | Connections are create/delete only |
| **Undo/redo operations** | Not implemented |
| **Confirmation dialogs** | Delete operations are immediate |

---

## 10. Future Roadmap

### Phase 2: Data Persistence
- SQLite or PostgreSQL database integration
- Data migration from in-memory to persistent storage
- Backup and restore functionality

### Phase 3: Enhanced Features
- Edit functionality for all entities via UI
- Search and filtering across people/events
- Export graph data to JSON
- Import data from JSON

### Phase 4: User Experience
- Timeline view for events
- Analytics and insights (most connected people, network statistics)
- Mobile responsive improvements
- Confirmation dialogs for destructive actions

### Phase 5: Multi-User
- User authentication (OAuth or email/password)
- Per-user data isolation
- Sharing graphs with others
- Real-time collaboration

### Phase 6: Telegram Integration
- Telegram bot for quick contact capture on-the-go
- `/add Name - notes` command to create people
- `/connect Person1, Person2` to create connections
- Account linking between Telegram and web app
- Conversational flow for guided data entry

---

## 11. Assumptions & Risks

### 11.1 Assumptions

| ID | Assumption |
|----|------------|
| A-001 | Users have modern browsers with JavaScript enabled |
| A-002 | Users have Node.js 14+ installed for running the application |
| A-003 | Application will be run locally (localhost) |
| A-004 | Users understand that data is not persisted across server restarts |
| A-005 | Graph will contain < 500 nodes in typical use |

### 11.2 Risks

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| R-001 | Data loss on server restart | High | Clear documentation; future: add persistence |
| R-002 | Performance degradation with large graphs | Medium | Optimize rendering; add pagination |
| R-003 | No authentication allows data access | Low (localhost) | Future: add auth for production |
| R-004 | CORS open policy is insecure | Low (localhost) | Future: restrict CORS for production |

### 11.3 Open Questions

| ID | Question | Status |
|----|----------|--------|
| Q-001 | Should connections support update operations? | Deferred to Phase 2 |
| Q-002 | Should events have attendee management in UI? | Deferred to Phase 2 |
| Q-003 | What database should be used for persistence? | Decision needed before Phase 2 |

---

## 12. Appendix: API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints Summary

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/graph` | Get complete graph | - | `{people[], events[], connections[]}` |
| GET | `/people` | List all people | - | `Person[]` |
| POST | `/people` | Create person | `Person` (name required) | `Person` (201) |
| GET | `/people/:id` | Get person by ID | - | `Person` or 404 |
| PUT | `/people/:id` | Update person | `Partial<Person>` | `Person` or 404 |
| DELETE | `/people/:id` | Delete person | - | 204 or 404 |
| GET | `/events` | List all events | - | `Event[]` |
| POST | `/events` | Create event | `Event` (name required) | `Event` (201) |
| GET | `/events/:id` | Get event by ID | - | `Event` or 404 |
| PUT | `/events/:id` | Update event | `Partial<Event>` | `Event` or 404 |
| DELETE | `/events/:id` | Delete event | - | 204 or 404 |
| GET | `/connections` | List all connections | - | `Connection[]` |
| POST | `/connections` | Create connection | `Connection` (from, to required) | `Connection` (201) or 400/404/409 |
| DELETE | `/connections/:id` | Delete connection | - | 204 or 404 |

### Error Responses

| Status | Meaning | Example Body |
|--------|---------|--------------|
| 400 | Bad Request (validation) | `{"error": "Name is required"}` |
| 404 | Not Found | `{"error": "Person not found"}` |
| 409 | Conflict (duplicate) | `{"error": "Connection already exists between these people"}` |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | - | Initial PRD documenting v1.0 implementation |

---

*This PRD documents the "What's Next" knowledge graph application as implemented. It serves as both a specification reference and a portfolio artifact demonstrating software requirements documentation skills.*
