import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryScreen from "../components/StoryScreen";

export default function Welcome() {
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");

    if (!token) return; // No token → Show Login button

    // Verify token with backend
    fetch(`http://127.0.0.1:5000/api/me?token=${token}`)
      .then(res => res.status === 200 ? setValidToken(true) : setValidToken(false))
      .catch(() => setValidToken(false));
  }, []);

  return (
    <StoryScreen>
      <div style={{ textAlign: "left", width: "min(480px, 90vw)" }}>
        <h1 style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          color: "white",
          marginBottom: "25px"
        }}>
          Wrapped Revanced 🎧
        </h1>

        <p style={{ color: "#9B9B9B", marginBottom: "40px" }}>
          Your Spotify listening story, whenever you want.
        </p>

        {!validToken && (
          <a href="http://127.0.0.1:5000/api/login">
            <button
              style={{
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
              Login with Spotify 🎶
            </button>
          </a>
        )}

        {validToken && (
          <button
            onClick={() => navigate("/top-tracks")}
            style={{
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
            Start →
          </button>
        )}
      </div>
    </StoryScreen>
  );
}
