import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StoryScreen from "../components/StoryScreen";
import Footer from "../components/Footer";
import { Button, SkeletonTrack, SkeletonArtist } from "../components/ui";
import { useTopTracks, useTopArtists } from "../hooks/useSpotify";
import analytics from "../utils/analytics";

function TrackCard({ track, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative flex items-center gap-4 p-4 hover:bg-white/10 rounded-xl transition-all group cursor-default backdrop-blur-sm bg-white/5"
    >
      <div className="flex items-center justify-center w-10 h-10 shrink-0">
        <span className="text-2xl font-black text-white">{index + 1}</span>
      </div>
      
      <div className="relative">
        <img 
          src={track.image || track.image_medium} 
          alt={track.name} 
          className="w-16 h-16 rounded-lg object-cover shadow-lg" 
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-lg truncate mb-1">{track.name}</h3>
        <p className="text-gray-400 text-sm truncate">{track.artist}</p>
      </div>
      {track.preview_url && (
        <button 
          className="w-12 h-12 shrink-0 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 hover:scale-110 flex items-center justify-center transition-all"
          onClick={(e) => { 
            e.stopPropagation();
            analytics.playPreview(track.name);
            const audio = new Audio(track.preview_url); 
            audio.play(); 
          }}
        >
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      )}
    </motion.div>
  );
}

function ArtistCard({ artist, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group cursor-default"
    >
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <div className="relative">
          <img 
            src={artist.image || artist.image_medium} 
            alt={artist.name} 
            className="w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white/10 group-hover:ring-white/30 transition-all" 
          />
          <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-black font-black text-sm sm:text-lg shadow-lg">
            {index + 1}
          </div>
        </div>
        <div className="text-center px-2">
          <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 truncate max-w-full">{artist.name}</h3>
          {artist.genres && artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300 capitalize truncate">
                {artist.genres[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Wrapped() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("long_term");
  const { data: tracks, isLoading: tracksLoading, error: tracksError } = useTopTracks(timeRange, 10);
  const { data: artists, isLoading: artistsLoading, error: artistsError } = useTopArtists(timeRange, 10);

  const timeRanges = [
    { value: "short_term", label: "Last 4 Weeks" },
    { value: "medium_term", label: "Last 6 Months" },
    { value: "long_term", label: "All Time" },
  ];

  const isLoading = tracksLoading || artistsLoading;

  useEffect(() => {
    analytics.pageView('wrapped');
  }, []);

  const handleTimeRangeChange = (newRange) => {
    analytics.timeRangeChange(timeRange, newRange);
    setTimeRange(newRange);
  };

  return (
    <StoryScreen>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 text-white">
            Your Wrapped
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">Your most played songs and artists</p>
          
          <div className="flex gap-2 justify-center flex-wrap">
            {timeRanges.map((range) => (
              <Button 
                key={range.value} 
                variant={timeRange === range.value ? "primary" : "secondary"} 
                size="sm" 
                onClick={() => handleTimeRangeChange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white">Top Tracks</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[...Array(6)].map((_, i) => <SkeletonTrack key={i} />)}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white">Top Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
                {[...Array(10)].map((_, i) => <SkeletonArtist key={i} />)}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                  Top Tracks
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">Your most played songs</p>
              </div>
              
              {tracksError ? (
                <div className="text-center py-12 text-gray-400">Failed to load tracks</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {tracks?.map((track, index) => (
                    <TrackCard key={track.id} track={track} index={index} />
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                  Top Artists
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">The artists you can't stop listening to</p>
              </div>
              
              {artistsError ? (
                <div className="text-center py-12 text-gray-400">Failed to load artists</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
                  {artists?.map((artist, index) => (
                    <ArtistCard key={artist.id} artist={artist} index={index} />
                  ))}
                </div>
              )}
            </motion.section>
          </div>
        )}

        <div className="flex gap-4 justify-center pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-white/10">
          <Button variant="outline" onClick={() => {
            analytics.buttonClick('back_home', 'wrapped');
            navigate("/");
          }}>Back Home</Button>
          <Button size="lg" onClick={() => {
            analytics.buttonClick('view_summary', 'wrapped');
            navigate("/summary");
          }}>View Summary</Button>
        </div>
        <Footer />
      </div>
    </StoryScreen>
  );
}
