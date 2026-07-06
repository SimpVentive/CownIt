import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { initDb, dbRun, dbGet, dbAll } from './db.js'
import { verifyToken, generateToken } from './middleware/auth.js'

// Hardcoded seed data (TypeScript seed.ts can't be imported directly)
const seedPeople = [
  { id: 'p1', name: 'Arjun Mehta', initials: 'AM', department: 'Operations', avatarColor: '#EEEDFE', avatarTextColor: '#3C3489' },
  { id: 'p2', name: 'Priya Sharma', initials: 'PS', department: 'Quality', avatarColor: '#E1F5EE', avatarTextColor: '#085041' },
  { id: 'p3', name: 'Rohan Das', initials: 'RD', department: 'Safety', avatarColor: '#FAEEDA', avatarTextColor: '#633806' },
  { id: 'p4', name: 'Meena Iyer', initials: 'MI', department: 'HR', avatarColor: '#FAECE7', avatarTextColor: '#993C1D' }
]

const app = express()
const PORT = process.env.BACKENDPORT || 6001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
await initDb()

// Seed database with initial data if empty
async function seedDatabase() {
  try {
    const count = await dbGet('SELECT COUNT(*) as count FROM people')
    if (count.count === 0) {
      console.log('Seeding database...')
      for (const person of seedPeople) {
        await dbRun(
          `INSERT INTO people (id, name, initials, department, avatarColor, avatarTextColor)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [person.id, person.name, person.initials, person.department, person.avatarColor, person.avatarTextColor]
        )
      }
      console.log('Database seeded successfully')
    }
  } catch (err) {
    console.error('Error seeding database:', err)
  }
}

await seedDatabase()

// Routes

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { userId, role } = req.body

  if (!userId || !role) {
    return res.status(400).json({ error: 'Missing userId or role' })
  }

  const token = generateToken(userId, role)
  res.json({ token, userId, role })
})

// People
app.get('/api/people', verifyToken, async (req, res) => {
  try {
    const people = await dbAll('SELECT * FROM people')
    res.json(people)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Commits
app.get('/api/commits', verifyToken, async (req, res) => {
  try {
    const commits = await dbAll('SELECT * FROM commits ORDER BY createdAt DESC')
    res.json(commits)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/commits', verifyToken, async (req, res) => {
  let { id, personId, level, statement, createdAt } = req.body;

  // Convert ISO date to MySQL DATETIME
  createdAt = new Date(createdAt)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    await dbRun(
      `INSERT INTO commits
      (id, personId, level, statement, createdAt)
      VALUES (?, ?, ?, ?, ?)`,
      [id, personId, level, statement, createdAt]
    );

    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Achievements
app.get('/api/achievements', verifyToken, async (req, res) => {
  try {
    const achievements = await dbAll('SELECT * FROM achievements ORDER BY date DESC')
    const parsedAchievements = achievements.map(a => ({
      ...a,
      cpqsdp: JSON.parse(a.cpqsdp)
    }))
    res.json(parsedAchievements)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/achievements', verifyToken, async (req, res) => {
  const { id, personId, commitId, title, evidence, cpqsdp, impactRating, date, fileAttachment } = req.body
  
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const datefield = parsedDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  
    try {
    await dbRun(
      `INSERT INTO achievements (id, personId, commitId, title, evidence, cpqsdp, impactRating, date, fileAttachment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, personId, commitId, title, evidence, JSON.stringify(cpqsdp), impactRating, datefield, fileAttachment]
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Monthly Updates
app.get('/api/monthlyUpdates', verifyToken, async (req, res) => {
  try {
    const updates = await dbAll('SELECT * FROM monthlyUpdates ORDER BY updatedAt DESC')
    res.json(updates)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/monthlyUpdates', verifyToken, async (req, res) => {
  const { id, personId, month, year, note, updatedAt } = req.body
  try {
    await dbRun(
      `INSERT INTO monthlyUpdates (id, personId, month, year, note, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, personId, month, year, note, updatedAt]
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Messages
app.get('/api/messages', verifyToken, async (req, res) => {
  try {
    const messages = await dbAll('SELECT id, fromRole, fromName, toPersonId, body, date, isRead as `read`, created_at FROM messages ORDER BY date DESC')
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/messages', verifyToken, async (req, res) => {
  const { id, fromRole, fromName, toPersonId, body, date, read } = req.body
  try {
    await dbRun(
      'INSERT INTO messages (id, fromRole, fromName, toPersonId, body, date, isRead)\n       VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, fromRole, fromName, toPersonId, body, date, read ? 1 : 0]
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/messages/:id/read', verifyToken, async (req, res) => {
  try {
    await dbRun('UPDATE messages SET isRead = 1 WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// HR Comments
app.get('/api/hrComments', verifyToken, async (req, res) => {
  try {
    const comments = await dbAll('SELECT * FROM hrComments ORDER BY date DESC')
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/hrComments', verifyToken, async (req, res) => {
  const { id, achievementId, authorName, body, date } = req.body
  try {
    await dbRun(
      `INSERT INTO hrComments (id, achievementId, authorName, body, date)
       VALUES (?, ?, ?, ?, ?)`,
      [id, achievementId, authorName, body, date]
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Start server
app.listen(PORT, () => {
  console.log(`CownIt server running on http://localhost:${PORT}`)
})
