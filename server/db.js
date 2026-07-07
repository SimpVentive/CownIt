import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'cownit',
} = process.env

async function createPool() {
  const rootPool = await mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 1,
  })

  await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``)
  await rootPool.end()

  return mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
}

const pool = await createPool()
console.log(`Connected to MySQL database ${DB_HOST}:${DB_PORT}/${DB_NAME}`)

const dbRun = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params)
  return result
}

const dbGet = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params)
  return rows[0]
}

const dbAll = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function initDb() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS people (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(25) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('individual','hr','ceo') NOT NULL,
        initials VARCHAR(10) NOT NULL,
        department VARCHAR(255) NOT NULL,
        avatarColor VARCHAR(50) NOT NULL,
        avatarTextColor VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await dbRun(`
      CREATE TABLE IF NOT EXISTS commits (
        id VARCHAR(255) PRIMARY KEY,
        personId VARCHAR(255) NOT NULL,
        level VARCHAR(50) NOT NULL,
        statement TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES people(id)
      )
    `)

    await dbRun(`
      CREATE TABLE IF NOT EXISTS achievements (
        id VARCHAR(255) PRIMARY KEY,
        personId VARCHAR(255) NOT NULL,
        commitId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
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

    await dbRun(`
      CREATE TABLE IF NOT EXISTS monthlyUpdates (
        id VARCHAR(255) PRIMARY KEY,
        personId VARCHAR(255) NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        note TEXT NOT NULL,
        updatedAt DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES people(id)
      )
    `)

    await dbRun(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        fromRole VARCHAR(100) NOT NULL,
        fromName VARCHAR(255) NOT NULL,
        toPersonId VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        date DATETIME NOT NULL,
        isRead TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (toPersonId) REFERENCES people(id)
      )
    `)

    await dbRun(`
      CREATE TABLE IF NOT EXISTS hrComments (
        id VARCHAR(255) PRIMARY KEY,
        achievementId VARCHAR(255) NOT NULL,
        authorName VARCHAR(255) NOT NULL,
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

export { dbRun, dbGet, dbAll }
