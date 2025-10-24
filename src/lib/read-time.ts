/**
 * Calculate estimated reading time for text content
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 225 wpm)
 * @returns Estimated reading time in minutes (rounded up, minimum 1)
 */
export function calculateReadTime(content: string, wordsPerMinute = 225): number {
  // Remove HTML tags and special characters for accurate word count
  const plainText = content
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Count words (split by whitespace and filter empty strings)
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Calculate reading time in minutes
  const minutes = wordCount / wordsPerMinute;

  // Round up and ensure minimum of 1 minute
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Calculate reading time from an Astro slot's rendered content
 * This is useful for calculating read time from markdown content
 */
export function calculateReadTimeFromHTML(html: string): number {
  return calculateReadTime(html);
}
