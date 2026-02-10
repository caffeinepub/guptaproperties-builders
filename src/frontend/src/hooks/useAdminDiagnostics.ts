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
 * Automatically refetches when invalidated by admin grant/revoke mutations.
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

        // Fetch admin list with isolated error handling
        let adminList: string[] = [];
        try {
          if (typeof actor.getAdminsList === 'function') {
            adminList = await actor.getAdminsList();
          }
        } catch (error: any) {
          // If unauthorized or anonymous, silently fail and return empty list
          // This allows the rest of the diagnostics to still be displayed
          if (error.message?.includes('Unauthorized') || error.message?.includes('Anonymous') || error.message?.includes('Admin access required')) {
            console.log('Admin list not available (requires admin access)');
            adminList = [];
          } else {
            // For other errors, log but don't fail the entire query
            console.warn('Failed to fetch admin list:', error);
            adminList = [];
          }
        }

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
    staleTime: 0, // Always fetch fresh data to reflect latest admin changes
    refetchOnMount: 'always', // Ensure fresh data on mount
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
