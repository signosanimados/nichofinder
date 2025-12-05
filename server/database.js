import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'nichofinder.db'));

export function initDatabase() {
  // Create analyses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT,
      input TEXT NOT NULL,
      result TEXT NOT NULL,
      youtube_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_analyses_type ON analyses(type);
    CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
  `);

  console.log('Database initialized');
}

export function saveAnalysis({ type, title, input, result, youtube_data = null }) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO analyses (id, type, title, input, result, youtube_data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, type, title, input, result, youtube_data);

  return { id, type, title, created_at: new Date().toISOString() };
}

export function getAnalyses(type = null, limit = 50) {
  let query = 'SELECT id, type, title, created_at FROM analyses';
  const params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

export function getAnalysisById(id) {
  const stmt = db.prepare('SELECT * FROM analyses WHERE id = ?');
  const row = stmt.get(id);

  if (row) {
    return {
      ...row,
      input: JSON.parse(row.input),
      result: JSON.parse(row.result),
      youtube_data: row.youtube_data ? JSON.parse(row.youtube_data) : null
    };
  }

  return null;
}

export function deleteAnalysis(id) {
  const stmt = db.prepare('DELETE FROM analyses WHERE id = ?');
  return stmt.run(id);
}

export function clearAllAnalyses() {
  const stmt = db.prepare('DELETE FROM analyses');
  return stmt.run();
}

export function getAnalysisStats() {
  const stats = db.prepare(`
    SELECT
      type,
      COUNT(*) as count,
      MAX(created_at) as last_analysis
    FROM analyses
    GROUP BY type
  `).all();

  const total = db.prepare('SELECT COUNT(*) as total FROM analyses').get();

  return {
    total: total.total,
    byType: stats
  };
}
