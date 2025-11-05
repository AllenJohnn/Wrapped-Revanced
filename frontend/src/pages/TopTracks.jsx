import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StoryScreen from "../components/StoryScreen";

export default function TopTracks() {
  const navigate = useNavigate();
  const token = localStorage.getItem("spotify_token");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/top-tracks?token=${token}`)
      .then(res => res.json())
      .then(setTracks);
  }, [token]);

  return (
    <StoryScreen>
      <div style={{ textAlign: "left", width: "min(480px, 90vw)" }}>
        <h1 style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          color: "white",
          marginBottom: "28px"
        }}>
          Your Top Tracks
        </h1>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
          }}
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >
          {tracks.slice(0, 5).map((track, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#111",
                padding: "16px 20px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 3px 10px rgba(0,0,0,0.45)"
              }}
            >
              {/* RANK */}
              <span style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#1DB954",
                width: "40px",
                textAlign: "center"
              }}>
                #{index + 1}
              </span>

              {/* ALBUM ART */}
              <img
                src={track.image}
                width="60"
                style={{
                  borderRadius: "10px"
                }}
                alt=""
              />

              {/* TEXT */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "white"
                }}>
                  {track.name}
                </span>
                <span style={{
                  fontSize: "0.95rem",
                  color: "#9B9B9B"
                }}>
                  {track.artist}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* NEXT BUTTON */}
        <button
          onClick={() => navigate("/top-artists")}
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
          Next →
        </button>
      </div>
    </StoryScreen>
  );
}
