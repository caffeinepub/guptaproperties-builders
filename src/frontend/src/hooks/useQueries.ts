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
        // Try the primary method first
        if (typeof actor.isCallerAdmin === 'function') {
          const result = await actor.isCallerAdmin();
          return result;
        }
        // Fallback to alternative method if primary doesn't exist
        if (typeof actor.checkIfCallerIsAdmin === 'function') {
          const result = await actor.checkIfCallerIsAdmin();
          return result;
        }
        // If neither method exists, return false
        console.warn('No admin check method available on actor');
        return false;
      } catch (error: any) {
        // Normalize backend errors to clear English
        if (error.message?.includes('Unauthorized') || error.message?.includes('Anonymous')) {
          // Not an error - just not admin or not authenticated
          return false;
        }
        // For other errors, log and return false to avoid breaking the UI
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    retryDelay: 500,
    staleTime: 0, // Always refetch to get latest admin status
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
