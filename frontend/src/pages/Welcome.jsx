import { useNavigate } from "react-router-dom";
import StoryScreen from "../components/StoryScreen";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <StoryScreen>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
          Wrapped Revanced 🎧
        </h1>

        <p style={{ opacity: 0.9 }}>Your year in music starts now.</p>

        <button
          onClick={() => navigate("/top-tracks")}
          style={{ marginTop: "40px" }}
        >
          Next →
        </button>
      </div>
    </StoryScreen>
  );
}
