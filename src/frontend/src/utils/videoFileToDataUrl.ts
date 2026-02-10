export async function videoFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate MIME type
    if (!file.type.startsWith('video/')) {
      reject(new Error('File must be a video'));
      return;
    }

    // No size limit - chunked upload handles large files
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
