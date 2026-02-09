import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole } from '../backend';

export function useGrantAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        const principal = Principal.fromText(principalText);
        await actor.assignCallerUserRole(principal, UserRole.admin);
      } catch (error: any) {
        // Normalize backend trap messages to clear English
        if (error.message?.includes('Unauthorized') || error.message?.includes('Only admins')) {
          throw new Error('Admin access required to grant admin privileges');
        }
        if (error.message?.includes('Invalid principal')) {
          throw new Error('Invalid Principal ID format');
        }
        throw new Error('Failed to grant admin access. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin status queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
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
        await actor.assignCallerUserRole(principal, UserRole.user);
      } catch (error: any) {
        // Normalize backend trap messages to clear English
        if (error.message?.includes('Unauthorized') || error.message?.includes('Only admins')) {
          throw new Error('Admin access required to revoke admin privileges');
        }
        if (error.message?.includes('Invalid principal')) {
          throw new Error('Invalid Principal ID format');
        }
        if (error.message?.includes('Cannot remove admin privileges from owner')) {
          throw new Error('Cannot remove admin privileges from the owner');
        }
        throw new Error('Failed to revoke admin access. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin status queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}
