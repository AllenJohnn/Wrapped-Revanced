const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getLoginUrl() {
    return `${this.baseURL}/api/login`;
  }

  async verifyToken(token) {
    return this.request(`/api/me?token=${token}`);
  }

  async getTopTracks(token, timeRange = 'short_term', limit = 50) {
    return this.request(`/api/top-tracks?token=${token}&time_range=${timeRange}&limit=${limit}`);
  }

  async getTopArtists(token, timeRange = 'short_term', limit = 50) {
    return this.request(`/api/top-artists?token=${token}&time_range=${timeRange}&limit=${limit}`);
  }

  async getStats(token, timeRange = 'short_term') {
    return this.request(`/api/stats?token=${token}&time_range=${timeRange}`);
  }

  async getUserProfile(token) {
    return this.request(`/api/me?token=${token}`);
  }
}

export const api = new ApiService();
export default api;
