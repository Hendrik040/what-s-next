const Database = require('better-sqlite3');
const path = require('path');

// Database file location
const DB_PATH = path.join(__dirname, 'data', 'whats-next.db');

// Initialize database with schema
function initializeDatabase() {
  const db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent access
  db.pragma('journal_mode = WAL');

  // Create tables if they don't exist
  const schema = `
    -- People table
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      profession TEXT,
      company TEXT,
      location TEXT,
      notes TEXT,
      tags TEXT,
      event_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
    );

    -- Events table
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      date TEXT,
      location TEXT,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );

    -- Connections table
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      from_id TEXT NOT NULL,
      to_id TEXT NOT NULL,
      relationship_type TEXT,
      strength INTEGER,
      notes TEXT,
      event_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (from_id) REFERENCES people(id) ON DELETE CASCADE,
      FOREIGN KEY (to_id) REFERENCES people(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_people_name ON people(name);
    CREATE INDEX IF NOT EXISTS idx_people_tags ON people(tags);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_connections_from ON connections(from_id);
    CREATE INDEX IF NOT EXISTS idx_connections_to ON connections(to_id);
    CREATE INDEX IF NOT EXISTS idx_connections_relationship ON connections(relationship_type);
  `;

  db.exec(schema);

  console.log('Database initialized successfully at:', DB_PATH);

  return db;
}

// Export singleton database instance
const db = initializeDatabase();

module.exports = db;
