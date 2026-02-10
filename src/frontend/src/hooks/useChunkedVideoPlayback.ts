import { useState, useEffect } from 'react';
import { ExternalBlob } from '../backend';

interface PlaybackState {
  objectUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useChunkedVideoPlayback(videoBlob: ExternalBlob | null | undefined) {
  const [state, setState] = useState<PlaybackState>({
    objectUrl: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!videoBlob) {
      setState({ objectUrl: null, isLoading: false, error: null });
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    const loadVideo = async () => {
      setState({ objectUrl: null, isLoading: true, error: null });

      try {
        // Use the direct URL for streaming and caching
        const directUrl = videoBlob.getDirectURL();
        
        if (isMounted) {
          setState({ objectUrl: directUrl, isLoading: false, error: null });
        }
      } catch (error: any) {
        if (isMounted) {
          setState({
            objectUrl: null,
            isLoading: false,
            error: error.message || 'Failed to load video',
          });
        }
      }
    };

    loadVideo();

    return () => {
      isMounted = false;
      if (objectUrl) {
        // Clean up object URL if we created one
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [videoBlob]);

  return state;
}
