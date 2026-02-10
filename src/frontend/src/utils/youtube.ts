/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    
    // youtube.com/watch?v=VIDEO_ID (including mobile)
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      return urlObj.searchParams.get('v');
    }
    
    // youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[0] || null;
    }
    
    // youtube.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[1] || null;
    }

    // youtube.com/shorts/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/shorts/')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[1] || null;
    }

    // youtube.com/live/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/live/')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[1] || null;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a string is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Converts a YouTube URL to an embeddable format
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Alias for getYouTubeEmbedUrl for backward compatibility
 */
export function getEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url);
}
