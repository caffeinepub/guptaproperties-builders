import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { normalizeICError } from '../utils/icError';
import type { Property } from '../backend';

// Property Listings Query
export function usePropertyListings() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listProperties();
      } catch (error: any) {
        const normalized = normalizeICError(error);
        console.error('Error fetching properties:', normalized);
        throw new Error(normalized.message);
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });

  return {
    properties: query.data || [],
    isLoading: actorFetching || query.isLoading,
    error: query.error ? (query.error as Error).message : null,
  };
}

// Create Property Mutation
export function useCreateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      price: bigint | null;
      location: string | null;
      images: string[];
      video: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.createProperty(
          data.title,
          data.description,
          data.price,
          data.location,
          data.images,
          data.video
        );
      } catch (error: any) {
        const normalized = normalizeICError(error);
        console.error('Error creating property:', normalized);
        throw new Error(normalized.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Update Property Mutation
export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      price: bigint | null;
      location: string | null;
      images: string[];
      video: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateProperty(
          data.id,
          data.title,
          data.description,
          data.price,
          data.location,
          data.images,
          data.video
        );
      } catch (error: any) {
        const normalized = normalizeICError(error);
        console.error('Error updating property:', normalized);
        throw new Error(normalized.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Delete Property Mutation
export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.deleteProperty(id);
      } catch (error: any) {
        const normalized = normalizeICError(error);
        console.error('Error deleting property:', normalized);
        throw new Error(normalized.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
