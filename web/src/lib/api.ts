const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('authToken', token);
}

export function getAuthToken() {
  return authToken || localStorage.getItem('authToken');
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('authToken');
}

const apiCall = async (endpoint: string, options?: RequestInit) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
};

// Auth
export async function login(email: string, password: string) {
  const data = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}

// People
export async function getPeople() {
  return apiCall('/api/people');
}

// Commits
export async function getCommits() {
  return apiCall('/api/commits');
}

export async function createCommit(commit: any) {
  return apiCall('/api/commits', {
    method: 'POST',
    body: JSON.stringify(commit),
  });
}

// Achievements
export async function getAchievements() {
  return apiCall('/api/achievements');
}

export async function createAchievement(achievement: any) {
  return apiCall('/api/achievements', {
    method: 'POST',
    body: JSON.stringify(achievement),
  });
}

// Monthly Updates
export async function getMonthlyUpdates() {
  return apiCall('/api/monthlyUpdates');
}

export async function createMonthlyUpdate(update: any) {
  return apiCall('/api/monthlyUpdates', {
    method: 'POST',
    body: JSON.stringify(update),
  });
}

// Messages
export async function getMessages() {
  return apiCall('/api/messages');
}

export async function createMessage(message: any) {
  return apiCall('/api/messages', {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

export async function markMessageAsRead(messageId: string) {
  return apiCall(`/api/messages/${messageId}/read`, {
    method: 'PUT',
  });
}

// HR Comments
export async function getHrComments() {
  return apiCall('/api/hrComments');
}

export async function createHrComment(comment: any) {
  return apiCall('/api/hrComments', {
    method: 'POST',
    body: JSON.stringify(comment),
  });
}
