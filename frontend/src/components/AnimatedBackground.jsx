import { motion } from 'framer-motion';

export default function AnimatedBackground({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
