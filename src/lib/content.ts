/** Shared content helpers — safe for client and server. */

export function computeReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 225));
  return `~${minutes} min`;
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function tagHref(tag: string): string {
  return `/tag/${tagSlug(tag)}`;
}
