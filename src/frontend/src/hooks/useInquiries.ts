import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Inquiry } from '../types';

// Note: Backend inquiry functionality has been removed
// This hook returns empty data until backend support is restored

export function useGetInquiries() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      // Backend method removed - return empty array
      return [];
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
