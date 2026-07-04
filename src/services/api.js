const API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log(API_URL);
let token = null

export const setToken = (newToken) => {
  token = newToken
}

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const login = async (userId, role) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, role })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  setToken(data.token)
  return data
}

export const fetchPeople = async () => {
  const res = await fetch(`${API_URL}/people`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch people')
  return data
}

export const fetchCommits = async () => {
  const res = await fetch(`${API_URL}/commits`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch commits')
  return data
}

export const createCommit = async (commit) => {
  const res = await fetch(`${API_URL}/commits`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(commit)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create commit')
  return data
}

export const fetchAchievements = async () => {
  const res = await fetch(`${API_URL}/achievements`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch achievements')
  return data
}

export const createAchievement = async (achievement) => {
  const res = await fetch(`${API_URL}/achievements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(achievement)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create achievement')
  return data
}

export const fetchMonthlyUpdates = async () => {
  const res = await fetch(`${API_URL}/monthlyUpdates`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch monthly updates')
  return data
}

export const createMonthlyUpdate = async (update) => {
  const res = await fetch(`${API_URL}/monthlyUpdates`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(update)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create monthly update')
  return data
}

export const fetchMessages = async () => {
  const res = await fetch(`${API_URL}/messages`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch messages')
  return data
}

export const createMessage = async (message) => {
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(message)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create message')
  return data
}

export const markMessageAsRead = async (messageId) => {
  const res = await fetch(`${API_URL}/messages/${messageId}/read`, {
    method: 'PUT',
    headers: getHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to mark message as read')
  return data
}

export const fetchHRComments = async () => {
  const res = await fetch(`${API_URL}/hrComments`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch HR comments')
  return data
}

export const createHRComment = async (comment) => {
  const res = await fetch(`${API_URL}/hrComments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(comment)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create HR comment')
  return data
}
