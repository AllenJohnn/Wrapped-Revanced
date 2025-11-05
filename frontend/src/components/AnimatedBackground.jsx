export default function AnimatedBackground({ children }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#0D0D0D", // Spotify Dark Black
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      {children}
    </div>
  );
}
