import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'cownit.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err)
  else console.log('Connected to SQLite database')
})

// Promisify db methods
const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })

// Initialize database schema
export async function initDb() {
  try {
    // People table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS people (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        initials TEXT NOT NULL,
        department TEXT NOT NULL,
        avatarColor TEXT NOT NULL,
        avatarTextColor TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Commits table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS commits (
        id TEXT PRIMARY KEY,
        personId TEXT NOT NULL,
        level TEXT NOT NULL,
        statement TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES people(id)
      )
    `)

    // Achievements table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        personId TEXT NOT NULL,
        commitId TEXT NOT NULL,
        title TEXT NOT NULL,
        evidence TEXT NOT NULL,
        cpqsdp TEXT NOT NULL,
        impactRating INTEGER NOT NULL,
        date DATETIME NOT NULL,
        fileAttachment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES people(id),
        FOREIGN KEY (commitId) REFERENCES commits(id)
      )
    `)

    // Monthly Updates table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS monthlyUpdates (
        id TEXT PRIMARY KEY,
        personId TEXT NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        note TEXT NOT NULL,
        updatedAt DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES people(id)
      )
    `)

    // Messages table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        fromRole TEXT NOT NULL,
        fromName TEXT NOT NULL,
        toPersonId TEXT NOT NULL,
        body TEXT NOT NULL,
        date DATETIME NOT NULL,
        read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (toPersonId) REFERENCES people(id)
      )
    `)

    // HR Comments table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS hrComments (
        id TEXT PRIMARY KEY,
        achievementId TEXT NOT NULL,
        authorName TEXT NOT NULL,
        body TEXT NOT NULL,
        date DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (achievementId) REFERENCES achievements(id)
      )
    `)

    console.log('Database schema initialized')
  } catch (err) {
    console.error('Error initializing database:', err)
  }
}

export { dbRun, dbGet, dbAll, db }
