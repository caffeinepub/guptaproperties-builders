export type PropertyVideoType = 
  | { type: 'youtube'; url: string }
  | { type: 'uploaded'; blob: any }
  | { type: 'none' };

export function getVideoType(video: any): PropertyVideoType {
  if (!video) {
    return { type: 'none' };
  }

  // Check if it's a string (YouTube URL or legacy data URL)
  if (typeof video === 'string') {
    // YouTube URLs
    if (video.includes('youtube.com') || video.includes('youtu.be')) {
      return { type: 'youtube', url: video };
    }
    // Legacy data URLs are no longer supported for new uploads
    // but we keep them for backward compatibility
    if (video.startsWith('data:video/')) {
      return { type: 'none' };
    }
    return { type: 'none' };
  }

  // Check if it's an ExternalBlob (has getDirectURL method)
  if (video && typeof video === 'object' && 'getDirectURL' in video) {
    return { type: 'uploaded', blob: video };
  }

  return { type: 'none' };
}
