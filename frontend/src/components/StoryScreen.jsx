import AnimatedBackground from "./AnimatedBackground";
import { motion } from "framer-motion";

export default function StoryScreen({ children }) {
  return (
    <AnimatedBackground>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatedBackground>
  );
}
