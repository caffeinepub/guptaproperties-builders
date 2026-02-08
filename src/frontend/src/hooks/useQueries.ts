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
      return await actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0, // Always refetch to get latest admin status
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
