export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error('Image must be smaller than 5MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
