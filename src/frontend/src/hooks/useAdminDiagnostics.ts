import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export interface AdminDiagnostics {
  backendCallerPrincipal: string;
  backendAdminList: string[];
  backendReportsIsAdmin: boolean;
}

/**
 * Hook to fetch admin diagnostics from the backend for troubleshooting.
 * Returns the backend-reported caller principal, admin list, and admin status.
 */
export function useAdminDiagnostics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalString = identity?.getPrincipal().toString() || 'anonymous';

  const query = useQuery<AdminDiagnostics>({
    queryKey: ['adminDiagnostics', principalString],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        // Fetch caller principal
        const callerPrincipal = await actor.getCallerPrincipalAsText();
        
        // Fetch admin status with fallback logic
        let isAdmin = false;
        try {
          if (typeof actor.isCallerAdmin === 'function') {
            isAdmin = await actor.isCallerAdmin();
          } else if (typeof actor.checkIfCallerIsAdmin === 'function') {
            isAdmin = await actor.checkIfCallerIsAdmin();
          }
        } catch (error: any) {
          // If unauthorized or anonymous, treat as not admin
          if (error.message?.includes('Unauthorized') || error.message?.includes('Anonymous')) {
            isAdmin = false;
          } else {
            throw error;
          }
        }

        // Note: Backend doesn't have listAdmins() yet, so we'll return empty array
        // This will be populated when backend adds the method
        const adminList: string[] = [];

        return {
          backendCallerPrincipal: callerPrincipal,
          backendAdminList: adminList,
          backendReportsIsAdmin: isAdmin,
        };
      } catch (error: any) {
        console.error('Error fetching admin diagnostics:', error);
        throw new Error(`Failed to fetch diagnostics: ${error.message || 'Unknown error'}`);
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    staleTime: 0, // Always fetch fresh data
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
