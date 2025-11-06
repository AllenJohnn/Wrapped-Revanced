import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Welcome from "./pages/Welcome";
import TopTracks from "./pages/TopTracks";
import TopArtists from "./pages/TopArtists";
import Summary from "./pages/Summary";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      localStorage.setItem("spotify_token", accessToken);
      setToken(accessToken);
      window.history.replaceState({}, document.title, "/"); // clean URL
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      setToken(savedToken && savedToken !== "undefined" ? savedToken : null);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Welcome token={token} />} />
      <Route path="/top-tracks" element={<TopTracks />} />
      <Route path="/top-artists" element={<TopArtists />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  );
}
