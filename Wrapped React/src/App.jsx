import React, { useEffect, useState } from 'react'

function App() {
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [token, setToken] = useState(null)

  // ✅ Step 1: Capture token from URL and save to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('token')

    if (accessToken) {
      localStorage.setItem('spotify_token', accessToken)
      window.history.replaceState({}, document.title, '/') // remove ?token= from URL
      setToken(accessToken)
      setLoggedIn(true)
    } else {
      const storedToken = localStorage.getItem('spotify_token')
      if (storedToken) {
        setToken(storedToken)
        setLoggedIn(true)
      }
    }
  }, [])

  // ✅ Step 2: Fetch top artists & tracks once logged in
  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        const artistsRes = await fetch('http://127.0.0.1:5000/api/top-artists', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (artistsRes.ok) {
          const data = await artistsRes.json()
          setArtists(data)
        }

        const tracksRes = await fetch('http://127.0.0.1:5000/api/top-tracks', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (tracksRes.ok) {
          const data = await tracksRes.json()
          setTracks(data)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }

    fetchData()
  }, [token])

  // ✅ Step 3: Login button → redirects to Flask login
  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:5000/login'
  }

  // ✅ Step 4: Optional logout
  const handleLogout = () => {
    localStorage.removeItem('spotify_token')
    setLoggedIn(false)
    setArtists([])
    setTracks([])
  }

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '40px' }}>
      <h1>🎧 Spotify Wrapped Revanced</h1>

      {!loggedIn ? (
        <>
          <p>Connect your Spotify to see your top artists and tracks.</p>
          <button
            onClick={handleLogin}
            style={{
              padding: '10px 20px',
              background: '#1DB954',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Login with Spotify
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              background: '#E53935',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              position: 'absolute',
              right: 20,
              top: 20,
            }}
          >
            Logout
          </button>

          <h2>Top Artists</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {artists.map((artist, i) => (
              <div key={i} style={{ width: 150 }}>
                <img
                  src={artist.image}
                  alt={artist.name}
                  width="150"
                  height="150"
                  style={{ borderRadius: '10px' }}
                />
                <p>
                  <b>{artist.name}</b>
                </p>
                <p style={{ color: 'gray' }}>{artist.genre}</p>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: '50px' }}>Top Tracks</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {tracks.map((track, i) => (
              <div key={i} style={{ width: 150 }}>
                <img
                  src={track.image}
                  alt={track.name}
                  width="150"
                  height="150"
                  style={{ borderRadius: '10px' }}
                />
                <p>
                  <b>{track.name}</b>
                </p>
                <p style={{ color: 'gray' }}>{track.artist}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App

// implement framer motion make it more responsive and use ant d as ui library