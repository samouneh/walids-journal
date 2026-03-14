/* Shared formatting utilities */

/** Strip markdown tokens and return a plain-text excerpt */
export function excerpt(text, max = 90) {
  const plain = text.replace(/[#*`>_~[\]]/g, '').trim();
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + '\u2026';
}

/** CSS class slug from a category name: "Markets & Investing" -> "markets---investing" */
export function catSlug(cat) {
  return cat.toLowerCase().replace(/[^a-z]/g, '-');
}

/** Human-readable relative time from an ISO string */
export function relTime(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return days + ' days ago';
  const weeks = Math.floor(days / 7);
  if (days < 30) return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Short formatted date: "14 Mar 2025" */
export function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Long formatted date: "Friday, 14 March 2025" */
export function formatDateLong(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** Estimated reading time in minutes */
export function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
