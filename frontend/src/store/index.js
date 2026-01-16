import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      
      setUser: (user) => set({ user }),
      
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => {
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem('spotify_token');
      },
      
      getToken: () => get().token,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
);

export const useDataStore = create((set) => ({
  topTracks: [],
  topArtists: [],
  stats: null,
  timeRange: 'short_term',
  
  setTopTracks: (tracks) => set({ topTracks: tracks }),
  setTopArtists: (artists) => set({ topArtists: artists }),
  setStats: (stats) => set({ stats }),
  setTimeRange: (range) => set({ timeRange: range }),
  
  clearData: () => set({
    topTracks: [],
    topArtists: [],
    stats: null,
  }),
}));
