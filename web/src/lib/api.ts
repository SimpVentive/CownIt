import type { Achievement, AchievementDraft, Dim } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

let authToken: string | null = localStorage.getItem("authToken");

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
  const isFormData = options?.body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const token = getAuthToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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

export async function signup(name: string, email: string, password: string) {
  const data = await apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
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

export async function updateCommit(id: string, commit: any) {
  return apiCall(`/api/commits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(commit),
  });
}

export async function deleteCommit(id: string) {
  return apiCall(`/api/commits/${id}`, {
    method: 'DELETE',
  });
}

// Achievements
export async function getAchievements() {
  return apiCall('/api/achievements');
}

export async function createAchievement(achievement: Achievement & { attachments?: Partial<Record<Dim, File>> }) {
  const { attachments, ...data } = achievement;
  const body = new FormData();
  body.append('achievement', JSON.stringify(data));
  Object.entries(attachments || {}).forEach(([dimension, file]) => {
    if (file instanceof File) body.append(dimension, file);
  });
  return apiCall('/api/achievements', {
    method: 'POST',
    body,
  });
}

export async function getAchievementDraft(): Promise<AchievementDraft | null> {
  return apiCall('/api/achievements/draft');
}

export async function saveAchievementDraft(draft: AchievementDraft, attachments: Partial<Record<Dim, File>>): Promise<AchievementDraft> {
  const body = new FormData();
  body.append('draft', JSON.stringify(draft));
  Object.entries(attachments).forEach(([dimension, file]) => body.append(dimension, file));
  return apiCall('/api/achievements/draft', { method: 'PUT', body });
}

export async function downloadAttachment(attachment: { filename: string; name: string }) {
  const headers: HeadersInit = {};
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}/api/uploads/${encodeURIComponent(attachment.filename)}`, { headers });
  if (!response.ok) throw new Error('Failed to download attachment');
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = attachment.name;
  link.click();
  URL.revokeObjectURL(url);
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

export function setSession(session: any) {
  localStorage.setItem("session", JSON.stringify(session));
}

export function getSession() {
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session) : null;
}

export function clearSession() {
  localStorage.removeItem("session");
}