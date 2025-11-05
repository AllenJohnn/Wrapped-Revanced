import AnimatedBackground from "./AnimatedBackground";
import { motion } from "framer-motion";

export default function StoryScreen({ children }) {
  return (
    <AnimatedBackground>
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          textAlign: "center",
          width: "100%",
          maxWidth: "900px",
          padding: "40px",
          position: "relative",
          zIndex: 10,
          margin: "0 auto"
        }}
      >
        {children}
      </motion.div>
    </AnimatedBackground>
  );
}
