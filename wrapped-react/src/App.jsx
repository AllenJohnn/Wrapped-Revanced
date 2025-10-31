import { useEffect, useState } from 'react'

function App() {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/top-artists')
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Top Artists</h1>
      <ul>
        {artists.map((a, i) => (
          <li key={i}>{a.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
