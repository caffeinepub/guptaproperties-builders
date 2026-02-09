import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

// Admin Status Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  // Include the principal in the query key so it refetches when identity changes
  const principalString = identity?.getPrincipal().toString() || 'anonymous';

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', principalString],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const result = await actor.isCallerAdmin();
        return result;
      } catch (error: any) {
        // Normalize backend errors to clear English
        if (error.message?.includes('Unauthorized')) {
          // Not an error - just not admin
          return false;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 2,
    retryDelay: 500,
    staleTime: 0, // Always refetch to get latest admin status
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
