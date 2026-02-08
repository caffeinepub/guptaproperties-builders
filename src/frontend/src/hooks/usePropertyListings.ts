import { useMemo } from 'react';
import { seedProperties } from '../data/siteData';
import type { Property } from '../types';

// Note: Backend property functionality has been removed
// This hook only returns seed properties until backend support is restored

export function usePropertyListings() {
  const properties = useMemo(() => {
    return seedProperties;
  }, []);

  return {
    properties,
    isLoading: false,
    error: null,
  };
}

export function useIsCustomProperty() {
  return (propertyId: string) => {
    // All properties are now seed properties
    return false;
  };
}
