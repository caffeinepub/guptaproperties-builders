/**
 * Normalizes Internet Computer canister errors into user-friendly messages
 * with categorization for better UI handling
 */

export type ErrorCategory = 'permission' | 'request-too-large' | 'invalid-input' | 'not-found' | 'generic';

export interface NormalizedError {
  message: string;
  category: ErrorCategory;
  originalError?: any;
}

/**
 * Normalizes IC agent/canister errors into actionable user messages
 */
export function normalizeICError(error: any): NormalizedError {
  const errorMessage = error?.message || String(error);
  
  // Permission/Authorization errors
  if (
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('Only admins') ||
    errorMessage.includes('permission') ||
    errorMessage.includes('not authorized')
  ) {
    return {
      message: 'You do not have permission to perform this action. Admin access is required.',
      category: 'permission',
      originalError: error,
    };
  }

  // Request too large (payload/video/image size)
  if (
    errorMessage.includes('request too large') ||
    errorMessage.includes('payload too large') ||
    errorMessage.includes('exceeds maximum') ||
    errorMessage.includes('too big') ||
    errorMessage.includes('size limit')
  ) {
    return {
      message: 'The request is too large. Try reducing image/video file sizes or using fewer images. For videos, YouTube URLs are recommended.',
      category: 'request-too-large',
      originalError: error,
    };
  }

  // Invalid input/format errors
  if (
    errorMessage.includes('invalid') ||
    errorMessage.includes('must be') ||
    errorMessage.includes('format')
  ) {
    return {
      message: errorMessage,
      category: 'invalid-input',
      originalError: error,
    };
  }

  // Not found errors
  if (
    errorMessage.includes('not found') ||
    errorMessage.includes('does not exist')
  ) {
    return {
      message: 'The requested item was not found.',
      category: 'not-found',
      originalError: error,
    };
  }

  // Generic fallback
  return {
    message: errorMessage || 'An unexpected error occurred. Please try again.',
    category: 'generic',
    originalError: error,
  };
}
