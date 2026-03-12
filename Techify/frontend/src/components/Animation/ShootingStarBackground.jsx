/**
 * 🌌 SHOOTING STAR BACKGROUND
 * 🛠️ Created by: Gemini 3 Flash (AI)
 * 🚀 Purpose: High-performance, cinematic space background with drifting stars.
 */

import React, { useMemo } from "react";
import { motion } from "framer-motion";

// ✨ Component for static twinkling stars
const Star = ({ size, top, left, duration, delay }) => (
  <motion.div
    initial={{ opacity: 0.2, scale: 0.8 }}
    animate={{
      opacity: [0.2, 0.8, 0.2], // Gentle breathing effect
      scale: [0.8, 1.1, 0.8],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.3)]"
    style={{
      width: size,
      height: size,
      top: top,
      left: left,
    }}
  />
);

// 🛸 Component for larger, slow-moving drifting stars
const DriftingStar = ({ size, top, left, duration, delay }) => (
  <motion.div
    initial={{ x: 0, y: 0, opacity: 0 }}
    animate={{
      x: [0, 30, 0], // Subtle horizontal drift
      y: [0, 20, 0], // Subtle vertical drift
      opacity: [0, 0.4, 0],
    }}
    transition={{
      duration: duration * 2,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
    className="absolute bg-cyan-400 rounded-full blur-[1px]"
    style={{
      width: size,
      height: size,
      top: top,
      left: left,
    }}
  />
);

const ShootingStarBackground = ({ children }) => {
  // 🧠 useMemo: Crucial for performance. 
  // It prevents stars from jumping to new random positions when the user types in the search bar.
  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, []);

  // 🧪 Generating the drifting layer
  const driftStars = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: `drift-${i}`,
      size: Math.random() * 3 + 2 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden flex flex-col items-center">
      
      {/* 🖼️ Background Layer: Contains all star animations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <Star key={star.id} {...star} />
        ))}
        {driftStars.map((star) => (
          <DriftingStar key={star.id} {...star} />
        ))}
        
        {/* 💡 Ambient Corner Glows: Adds depth and color to the void */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      {/* 🖥️ Main Content: Your Table and Search bar sit in this higher Z-index layer */}
      <div className="relative z-10 w-full flex flex-col items-center h-full px-4">
        {children}
      </div>
    </div>
  );
};

export default ShootingStarBackground;