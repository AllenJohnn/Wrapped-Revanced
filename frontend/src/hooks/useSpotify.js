import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store';

export function useUserProfile() {
  const token = useAuthStore((state) => state.token);
  
  return useQuery({
    queryKey: ['user-profile', token],
    queryFn: () => api.getUserProfile(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTopTracks(timeRange = 'short_term', limit = 50) {
  const token = useAuthStore((state) => state.token);
  
  return useQuery({
    queryKey: ['top-tracks', token, timeRange, limit],
    queryFn: () => api.getTopTracks(token, timeRange, limit),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTopArtists(timeRange = 'short_term', limit = 50) {
  const token = useAuthStore((state) => state.token);
  
  return useQuery({
    queryKey: ['top-artists', token, timeRange, limit],
    queryFn: () => api.getTopArtists(token, timeRange, limit),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStats(timeRange = 'short_term') {
  const token = useAuthStore((state) => state.token);
  
  return useQuery({
    queryKey: ['stats', token, timeRange],
    queryFn: () => api.getStats(token, timeRange),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
}
