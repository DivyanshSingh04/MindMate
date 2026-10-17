const API_BASE = '/api';

/**
 * Ensures a consistent, 100% anonymous ID for the student's browser session.
 * Never requires personal identifiable information (PII).
 */
export const getAnonymousId = () => {
  let id = localStorage.getItem('mindmate_anonymous_id');
  if (!id) {
    id = 'anon_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('mindmate_anonymous_id', id);
  }
  return id;
};

/**
 * Reset anonymous ID (if student wants a clean slate)
 */
export const resetAnonymousId = () => {
  const newId = 'anon_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  localStorage.setItem('mindmate_anonymous_id', newId);
  return newId;
};

/**
 * Trigger Gemini AI analysis for a journal entry
 */
export const analyzeJournalWithAI = async ({ journalText, mood, moodScore }) => {
  const response = await fetch(`${API_BASE}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ journalText, mood, moodScore })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze journal with Gemini');
  }

  return response.json();
};

/**
 * Save mood check-in along with optional journal and AI recommendations
 */
export const saveMoodCheckIn = async (entryData) => {
  const response = await fetch(`${API_BASE}/moods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entryData)
  });

  if (!response.ok) {
    throw new Error('Failed to save mood log');
  }

  return response.json();
};

/**
 * Fetch past mood entries for this anonymous student
 */
export const fetchPastEntries = async (anonymousId) => {
  const response = await fetch(`${API_BASE}/moods/user/${anonymousId}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

/**
 * Fetch trends & analytics
 */
export const fetchAnalytics = async (anonymousId) => {
  const response = await fetch(`${API_BASE}/moods/analytics/${anonymousId}`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};
