import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import StoryScreen from "../components/StoryScreen";
import Footer from "../components/Footer";
import { Button, SkeletonStat } from "../components/ui";
import { useTopTracks, useTopArtists, useStats } from "../hooks/useSpotify";
import { useAuthStore } from "../store";
import analytics from "../utils/analytics";

function StatCard({ label, value, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="text-5xl sm:text-6xl font-black mb-3 text-white">
        {value}
      </div>
      <div className="text-sm sm:text-base text-gray-300 font-medium">{label}</div>
    </motion.div>
  );
}

export default function Summary() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const { logout } = useAuthStore();
  const [timeRange] = useState("long_term");

  const { data: tracks } = useTopTracks(timeRange, 5);
  const { data: artists } = useTopArtists(timeRange, 5);
  const { data: stats, isLoading } = useStats(timeRange);

  useEffect(() => {
    analytics.pageView('summary');
  }, []);

  const downloadCard = async () => {
    analytics.downloadCard();
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: '#0D0D0D' });
      const link = document.createElement("a");
      link.download = "spotify-wrapped.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleLogout = () => {
    analytics.buttonClick('logout', 'summary');
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <StoryScreen>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-12 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 text-white">Your Wrapped</h1>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => <SkeletonStat key={i} />)}
          </div>
        </div>
      </StoryScreen>
    );
  }

  const topTrack = tracks?.[0];
  const topArtist = artists?.[0];

  return (
    <StoryScreen>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 text-white">
            Your Wrapped
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">Here's what you've been listening to</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <StatCard label="Minutes Listened" value={Math.floor(stats?.total_listening_time_hours * 60 || 0).toLocaleString()} delay={0.1} />
          <StatCard label="Top Tracks" value={stats?.total_tracks || 0} delay={0.2} />
          <StatCard label="Top Artists" value={stats?.total_artists || 0} delay={0.3} />
          <StatCard label="Top Genre" value={stats?.top_genres?.[0]?.name?.split(' ').slice(0, 2).join(' ') || 'Music'} delay={0.4} />
        </div>

        <motion.div 
          ref={cardRef} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <div className="bg-white/10 p-1 rounded-3xl">
            <div className="bg-black rounded-3xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 text-center">Your Top Picks</h2>
              
              <div className="space-y-10">
                {topArtist && (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-6 font-medium">Top Artist</p>
                    <div className="inline-block relative mb-6">
                      <img 
                        src={topArtist.image || topArtist.image_medium} 
                        alt={topArtist.name} 
                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover ring-4 ring-white/20" 
                      />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{topArtist.name}</h3>
                    <p className="text-gray-400 text-sm mt-2 capitalize">{topArtist.genres?.[0] || 'Artist'}</p>
                  </div>
                )}
                
                {topTrack && (
                  <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-6 font-medium">Top Song</p>
                    <div className="flex items-center justify-center gap-6 max-w-md mx-auto">
                      <img 
                        src={topTrack.image || topTrack.image_medium} 
                        alt={topTrack.name} 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-2xl" 
                      />
                      <div className="text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{topTrack.name}</h3>
                        <p className="text-gray-400 text-base">{topTrack.artist}</p>
                      </div>
                    </div>
                  </div>
                )}

                {stats?.top_genres && stats.top_genres.length > 0 && (
                  <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-medium">Your Top Genres</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {stats.top_genres.slice(0, 5).map((genre, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm text-white font-medium capitalize">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={downloadCard}>Download Card</Button>
          <Button size="lg" variant="outline" onClick={() => {
            analytics.buttonClick('back_to_wrapped', 'summary');
            navigate("/wrapped");
          }}>Back to Wrapped</Button>
          <Button size="lg" variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        <Footer />
      </div>
    </StoryScreen>
  );
}
