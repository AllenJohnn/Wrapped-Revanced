import { Routes, Route, useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import TopTracks from "./pages/TopTracks";
import TopArtists from "./pages/TopArtists";
import Summary from "./pages/Summary";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/top-tracks" element={<TopTracks />} />
      <Route path="/top-artists" element={<TopArtists />} />
      <Route path="/summary" element={<Summary />} />

    </Routes>
  );
}
