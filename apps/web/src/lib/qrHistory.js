/**
 * LocalStorage-based QR Code generation history manager for QRHub.
 * Keeps user data completely local and 100% private in their browser.
 * Only saves QR codes that the user explicitly generates, downloads, or copies.
 */

const STORAGE_KEY = 'qrhub_history_v1';
const LEGACY_STORAGE_KEY = 'qrify_history_v1';
const MAX_ITEMS = 100;

export const DEFAULT_TAGS = ['All', 'General', 'Work', 'Personal', 'Event', 'Restaurant'];

export function getHistory() {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    // Backward compatibility migration
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
      }
    }
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load QR history', e);
    return [];
  }
}

export function saveToHistory(entry) {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const newEntry = {
      id: entry.id || 'qr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: entry.type || 'url',
      payload: entry.payload || '',
      title: entry.title || (entry.type ? entry.type.toUpperCase() + ' QR' : 'QR Code'),
      tag: entry.tag || 'General',
      fgColor: entry.fgColor || '#000000',
      bgColor: entry.bgColor || '#ffffff',
      size: entry.size || 256,
      ecc: entry.ecc || 'M',
      logoUrl: entry.logoUrl || '',
      createdAt: new Date().toISOString(),
    };

    // Avoid exact duplicate adjacent entries
    const filtered = history.filter(h => h.payload !== newEntry.payload || h.type !== newEntry.type);
    const updated = [newEntry, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (e) {
    console.error('Failed to save QR to history', e);
  }
}

export function updateHistoryEntry(id, updates) {
  if (typeof window === 'undefined') return [];
  try {
    const history = getHistory();
    const updated = history.map((item) => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update QR history entry', e);
    return [];
  }
}

export function deleteFromHistory(id) {
  if (typeof window === 'undefined') return [];
  try {
    const history = getHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete QR from history', e);
    return [];
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear QR history', e);
  }
}
