import { useState, useCallback } from 'react';
import { ExternalBlob } from '../backend';

interface UploadProgress {
  percentage: number;
  isUploading: boolean;
  error: string | null;
}

export function useChunkedVideoUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    isUploading: false,
    error: null,
  });

  const uploadVideo = useCallback(async (file: File): Promise<ExternalBlob> => {
    setProgress({ percentage: 0, isUploading: true, error: null });

    try {
      // Validate MIME type
      if (!file.type.startsWith('video/')) {
        throw new Error('File must be a video');
      }

      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with progress tracking
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setProgress({ percentage, isUploading: true, error: null });
      });

      // The upload happens when the blob is used in a backend call
      // Set to 100% to indicate ready state
      setProgress({ percentage: 100, isUploading: false, error: null });

      return blob;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to upload video';
      setProgress({ percentage: 0, isUploading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  const reset = useCallback(() => {
    setProgress({ percentage: 0, isUploading: false, error: null });
  }, []);

  return {
    uploadVideo,
    progress,
    reset,
  };
}
