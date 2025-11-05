import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StoryScreen from "../components/StoryScreen";

export default function TopArtists() {
  const navigate = useNavigate();
  const token = localStorage.getItem("spotify_token");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/top-artists?token=${token}`)
      .then(res => res.json())
      .then(setArtists);
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
          Your Top Artists
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
          {artists.slice(0, 5).map((artist, index) => (
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
                gap: "16px",
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

              {/* ARTIST IMAGE (CIRCLE STYLE) */}
              <img
                src={artist.image}
                width="60"
                height="60"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
                alt=""
              />

              {/* TEXT */}
              <span style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "white"
              }}>
                {artist.name}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* NEXT BUTTON */}
        <button
          onClick={() => navigate("/summary")}
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
