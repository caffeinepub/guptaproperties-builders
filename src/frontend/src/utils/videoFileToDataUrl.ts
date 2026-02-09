export async function videoFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate MIME type
    if (!file.type.startsWith('video/')) {
      reject(new Error('File must be a video'));
      return;
    }

    // Check file size (max 10MB for videos to stay within IC request limits)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error('Video must be smaller than 10MB. For larger videos, please use a YouTube URL instead.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read video file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read video file'));
    };
    
    reader.readAsDataURL(file);
  });
}
