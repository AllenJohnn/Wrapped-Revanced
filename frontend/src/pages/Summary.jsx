import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import StoryScreen from "../components/StoryScreen";

export default function Summary() {
  const token = localStorage.getItem("spotify_token");
  const [topTrack, setTopTrack] = useState(null);
  const [topArtist, setTopArtist] = useState(null);

  useEffect(() => {
    if (!token) return;

    // Fetch top track
    fetch(`http://localhost:5000/api/top-tracks?token=${token}`)
      .then(res => res.json())
      .then(data => setTopTrack(data[0]));

    // Fetch top artist
    fetch(`http://localhost:5000/api/top-artists?token=${token}`)
      .then(res => res.json())
      .then(data => setTopArtist(data[0]));
  }, [token]);


  const downloadCard = () => {
    const card = document.getElementById("summary-card");
    html2canvas(card, { scale: 3 }).then(canvas => {
      const link = document.createElement("a");
      link.download = "wrapped-summary.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <StoryScreen>
      <div style={{ width: "min(480px, 90vw)", textAlign: "center" }}>
        <h1 style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          color: "white",
          marginBottom: "30px"
        }}>
          Your Sound Capsule 🎧
        </h1>

        {/* SHARE CARD */}
        <motion.div
          id="summary-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: "#111",
            borderRadius: "18px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.45)"
          }}
        >
          <p style={{ color: "#9B9B9B", marginBottom: "6px" }}>Top Artist</p>
          {topArtist && (
            <div style={{ marginBottom: "20px" }}>
              <img
                src={topArtist.image}
                width="90"
                height="90"
                style={{ borderRadius: "50%", marginBottom: "10px" }}
                alt=""
              />
              <p style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "white"
              }}>
                {topArtist.name}
              </p>
            </div>
          )}

          <p style={{ color: "#9B9B9B", marginBottom: "6px" }}>Top Track</p>
          {topTrack && (
            <div>
              <img
                src={topTrack.image}
                width="90"
                height="90"
                style={{ borderRadius: "10px", marginBottom: "10px" }}
                alt=""
              />
              <p style={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "white"
              }}>
                {topTrack.name}
              </p>
              <p style={{ color: "#9B9B9B", fontSize: "1rem" }}>
                {topTrack.artist}
              </p>
            </div>
          )}
        </motion.div>

        {/* SAVE BUTTON */}
        <button
          onClick={downloadCard}
          style={{
            marginTop: "40px",
            background: "#1DB954",
            border: "none",
            padding: "14px 32px",
            borderRadius: "24px",
            color: "black",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Save as Image 🖼️
        </button>
      </div>
    </StoryScreen>
  );
}
