import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'weather.db'));

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'USER'
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    area TEXT,
    severity TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    author_id TEXT,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    endpoint TEXT,
    auth TEXT,
    p256dh TEXT,
    area TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS weather_history (
    id TEXT PRIMARY KEY,
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    temperature REAL,
    humidity REAL,
    wind_speed REAL,
    wind_direction REAL,
    precipitation REAL,
    symbol_code TEXT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS location_cache (
    id TEXT PRIMARY KEY,
    latitude REAL,
    longitude REAL,
    name TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);