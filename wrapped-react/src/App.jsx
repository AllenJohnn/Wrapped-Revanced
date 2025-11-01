import React, { useEffect, useState } from 'react';
import './App.css';

function Navbar({ onLogin, onLogout, profile }) {
  return (
    <header className="nav">
      <div className="nav-left">
        <h2 className="brand">MED-Wrapped</h2>
        {profile && (
          <nav className="nav-links">
            <a href="#artists">Artists</a>
            <a href="#tracks">Tracks</a>
          </nav>
        )}
      </div>

      <div className="nav-right">
        {profile ? (
          <div className="profile">
            <img src={profile?.images?.[0]?.url} alt="Profile" />
            <div className="profile-info">
              <div className="name">{profile.display_name}</div>
              <div className="followers">{profile.followers.total} followers</div>
            </div>
            <button className="btn small" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn" onClick={onLogin}>Login with Spotify</button>
        )}
      </div>
    </header>
  );
}

function TimeFilters({ value, onChange }) {
  return (
    <div className="filters">
      <button className={value === 'short_term' ? 'active' : ''} onClick={() => onChange('short_term')}>
        Last 4 Weeks
      </button>
      <button className={value === 'medium_term' ? 'active' : ''} onClick={() => onChange('medium_term')}>
        Last 6 Months
      </button>
      <button className={value === 'long_term' ? 'active' : ''} onClick={() => onChange('long_term')}>
        All Time
      </button>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [loading, setLoading] = useState(false);

  // ✅ Handle login/logout/token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('token');
    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem('spotify_token', accessToken);
      window.history.replaceState({}, '', '/');
    } else {
      const saved = localStorage.getItem('spotify_token');
      if (saved) setToken(saved);
    }
  }, []);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profileRes, artistRes, trackRes] = await Promise.all([
        fetch('http://localhost:5000/profile', { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/top-artists?time_range=${timeRange}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/top-tracks?time_range=${timeRange}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setProfile(await profileRes.json());
      setArtists((await artistRes.json()).items || []);
      setTracks((await trackRes.json()).items || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [token, timeRange]);

  const handleLogin = () => window.location.href = 'http://localhost:5000/login';
  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    setToken(null);
    setProfile(null);
  };

  return (
    <div>
      <Navbar onLogin={handleLogin} onLogout={handleLogout} profile={profile} />

      {!token ? (
        <div className="main">
          <h1>Welcome to MED-Wrapped</h1>
          <p className="muted">Login with Spotify to see your personalized wrap</p>
        </div>
      ) : (
        <div className="main">
          <div className="hero">
            <h1>Your Spotify Wrapped</h1>
            <p className="subtitle">Your music journey, reinvented.</p>
          </div>

          <TimeFilters value={timeRange} onChange={setTimeRange} />

          {loading && <p className="muted">Loading...</p>}

          {/* 🎤 Top Artists */}
          <section id="artists" className="grid-section">
            <h2>Top Artists</h2>
            <div className="grid">
              {artists.map((artist) => (
                <div className="card" key={artist.id}>
                  <div className="thumb">
                    <img src={artist.images?.[0]?.url} alt={artist.name} />
                  </div>
                  <div className="card-body">
                    <h3>{artist.name}</h3>
                    <p className="meta">{artist.genres?.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 🎵 Top Tracks */}
          <section id="tracks" className="tracks-section">
            <h2>Top Tracks</h2>
            <ul className="track-list">
              {tracks.map((track) => (
                <li className="track-item" key={track.id}>
                  <img className="track-img" src={track.album.images?.[0]?.url} alt={track.name} />
                  <div>
                    <div className="track-name">{track.name}</div>
                    <div className="track-artist">{track.artists.map((a) => a.name).join(', ')}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
