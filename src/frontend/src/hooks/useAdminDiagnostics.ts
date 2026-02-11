import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export interface AdminDiagnostics {
  backendCallerPrincipal: string;
  backendAdminList: string[];
  backendAdminListStatus: 'loaded' | 'empty' | 'unauthorized' | 'unavailable';
  backendReportsIsAdmin: boolean;
  // Frontend-side environment context
  currentOrigin: string;
  currentHost: string;
  environmentLabel: string;
}

/**
 * Hook to fetch admin diagnostics from the backend for troubleshooting.
 * Returns the backend-reported caller principal, admin list, admin status,
 * and frontend environment context for cross-deployment verification.
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
        // Use frontend identity for caller principal since backend doesn't expose it
        const callerPrincipal = identity?.getPrincipal().toString() || 'anonymous';
        
        // Fetch admin status
        let isAdmin = false;
        try {
          if (typeof actor.isCallerAdmin === 'function') {
            isAdmin = await actor.isCallerAdmin();
          }
        } catch (error: any) {
          // If unauthorized or anonymous, treat as not admin
          if (error.message?.includes('Unauthorized') || error.message?.includes('Anonymous')) {
            isAdmin = false;
          } else {
            throw error;
          }
        }

        // Fetch admin list from backend
        let adminList: string[] = [];
        let adminListStatus: 'loaded' | 'empty' | 'unauthorized' | 'unavailable' = 'unavailable';
        
        try {
          if (typeof actor.getAdminsList === 'function') {
            const list = await actor.getAdminsList();
            adminList = list || [];
            adminListStatus = adminList.length > 0 ? 'loaded' : 'empty';
          } else {
            adminListStatus = 'unavailable';
          }
        } catch (error: any) {
          // Handle unauthorized access gracefully
          if (error.message?.includes('Unauthorized') || error.message?.includes('Admin access required')) {
            adminListStatus = 'unauthorized';
          } else {
            // Log but don't throw - allow diagnostics to render with other info
            console.warn('Failed to fetch admin list:', error);
            adminListStatus = 'unavailable';
          }
        }

        // Derive environment label from hostname
        const host = window.location.host;
        const origin = window.location.origin;
        let environmentLabel = 'Unknown';
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
          environmentLabel = 'Local Development';
        } else if (host.includes('.ic0.app') || host.includes('.icp0.io')) {
          // Check if it's a raw canister URL or custom domain
          if (host.match(/^[a-z0-9-]+\.ic0\.app$/) || host.match(/^[a-z0-9-]+\.icp0\.io$/)) {
            environmentLabel = 'IC Network (Canister URL)';
          } else {
            environmentLabel = 'IC Network';
          }
        } else {
          environmentLabel = 'Custom Domain';
        }

        return {
          backendCallerPrincipal: callerPrincipal,
          backendAdminList: adminList,
          backendAdminListStatus: adminListStatus,
          backendReportsIsAdmin: isAdmin,
          currentOrigin: origin,
          currentHost: host,
          environmentLabel,
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
