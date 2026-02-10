import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';

export function useGrantAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        const principal = Principal.fromText(principalText);
        
        // Try grantAdmin method first (preferred)
        if (typeof actor.grantAdmin === 'function') {
          await actor.grantAdmin(principal);
        } else {
          throw new Error('Admin management method not available');
        }
      } catch (error: any) {
        // Normalize backend trap messages to clear English
        if (error.message?.includes('Unauthorized') || error.message?.includes('Admin access required')) {
          throw new Error('Admin access required to grant admin privileges');
        }
        if (error.message?.includes('Invalid principal') || error.message?.includes('not a valid principal')) {
          throw new Error('Invalid Principal ID format');
        }
        if (error.message?.includes('not available')) {
          throw error;
        }
        throw new Error('Failed to grant admin access. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate all admin-related queries to refresh UI state
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['adminDiagnostics'] });
    },
  });
}

export function useRevokeAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        const principal = Principal.fromText(principalText);
        
        // Try revokeAdmin method first (preferred)
        if (typeof actor.revokeAdmin === 'function') {
          await actor.revokeAdmin(principal);
        } else {
          throw new Error('Admin management method not available');
        }
      } catch (error: any) {
        // Normalize backend trap messages to clear English
        if (error.message?.includes('Unauthorized') || error.message?.includes('Admin access required')) {
          throw new Error('Admin access required to revoke admin privileges');
        }
        if (error.message?.includes('Invalid principal') || error.message?.includes('not a valid principal')) {
          throw new Error('Invalid Principal ID format');
        }
        if (error.message?.includes('Cannot remove admin privileges from owner')) {
          throw new Error('Cannot remove admin privileges from the owner');
        }
        if (error.message?.includes('not available')) {
          throw error;
        }
        throw new Error('Failed to revoke admin access. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate all admin-related queries to refresh UI state
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['adminDiagnostics'] });
    },
  });
}
