/**
 * Penyimpanan lokal untuk fitur Al-Qur'an: halaman terakhir, bookmark, mode malam,
 * dan jumlah halaman yang dibaca hari ini.
 */
import { QURAN_TOTAL_PAGES } from '../data/quranData';
import { getTodayKey } from './storage';

const K_LAST = 'adzkar_quran_last_page';
const K_BOOKMARKS = 'adzkar_quran_bookmarks';
const K_NIGHT = 'adzkar_quran_night';
const K_READ_PREFIX = 'adzkar_quran_read_';

const clampPage = (n: number) => Math.min(QURAN_TOTAL_PAGES, Math.max(1, Math.round(n) || 1));

export function loadQuranLastPage(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(K_LAST);
    if (!raw) return null;
    return clampPage(parseInt(raw, 10));
  } catch {
    return null;
  }
}

export function saveQuranLastPage(page: number): void {
  try {
    localStorage.setItem(K_LAST, String(clampPage(page)));
  } catch {
    // ignore
  }
}

export function loadQuranBookmarks(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(K_BOOKMARKS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

export function saveQuranBookmarks(pages: number[]): void {
  try {
    localStorage.setItem(K_BOOKMARKS, JSON.stringify(pages));
  } catch {
    // ignore
  }
}

export function loadQuranNightMode(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(K_NIGHT);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export function saveQuranNightMode(on: boolean): void {
  try {
    localStorage.setItem(K_NIGHT, on ? '1' : '0');
  } catch {
    // ignore
  }
}

export function loadQuranReadToday(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(K_READ_PREFIX + getTodayKey());
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Tandai sebuah halaman sudah dibaca hari ini; mengembalikan jumlah halaman unik hari ini. */
export function markQuranPageRead(page: number): number {
  try {
    const set = new Set(loadQuranReadToday());
    set.add(clampPage(page));
    localStorage.setItem(K_READ_PREFIX + getTodayKey(), JSON.stringify([...set]));
    return set.size;
  } catch {
    return 0;
  }
}
