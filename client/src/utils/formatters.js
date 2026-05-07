/**
 * Formats a UTC date string into a relative time string (e.g. "3 hours ago").
 * Falls back to the raw value if it can't be parsed.
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "unknown time";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // return raw if unparseable

  const now   = new Date();
  const diffMs  = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1)  return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24)  return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
};

/**
 * Truncates a URL to a readable hostname for display.
 */
export const formatDomain = (url) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
};
