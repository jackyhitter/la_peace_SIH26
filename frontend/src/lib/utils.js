import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatISTTime(isoString, includeDate = false) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);

    // Format in Indian Standard Time (UTC+5:30)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    if (includeDate) {
      options.day = '2-digit';
      options.month = 'short';
      options.year = 'numeric';
    }

    const formatted = new Intl.DateTimeFormat('en-IN', options).format(d);
    return includeDate ? `${formatted} IST` : `${formatted}`;
  } catch (e) {
    return String(isoString);
  }
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return String(isoString);
  }
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
}

export function getConfidenceColor(confidence) {
  if (confidence === null || confidence === undefined) return 'text-[var(--text-dim)]';
  const val = Number(confidence);
  if (val >= 90) return 'text-[var(--signal-green)]';
  if (val >= 70) return 'text-[var(--signal-amber)]';
  return 'text-[var(--signal-red)]';
}
