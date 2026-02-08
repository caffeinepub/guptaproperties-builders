import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole } from '../backend';

export function useListAdmins() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Principal[]>({
    queryKey: ['adminList'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // We'll get all users with admin role by checking their roles
        // Since backend doesn't have a listAdmins method, we'll use getCallerUserRole
        // and track admins client-side or return empty for now
        return [];
      } catch (error) {
        console.error('Error fetching admin list:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

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
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Admin access required to grant admin privileges');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
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
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Admin access required to revoke admin privileges');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
    },
  });
}
