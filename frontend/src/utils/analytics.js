const analytics = {
  track: (eventName, properties = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${eventName}`, properties);
      
      try {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push({
          event: eventName,
          properties,
          timestamp: new Date().toISOString()
        });
        
        if (events.length > 100) {
          events.shift();
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(events));
      } catch (error) {
        console.error('Analytics error:', error);
      }
    }
  },

  pageView: (pageName) => {
    analytics.track('page_view', { page: pageName });
  },

  buttonClick: (buttonName, location) => {
    analytics.track('button_click', { button: buttonName, location });
  },

  timeRangeChange: (oldRange, newRange) => {
    analytics.track('time_range_change', { from: oldRange, to: newRange });
  },

  downloadCard: () => {
    analytics.track('download_card');
  },

  playPreview: (trackName) => {
    analytics.track('play_preview', { track: trackName });
  },

  getEvents: () => {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  }
};

export default analytics;
