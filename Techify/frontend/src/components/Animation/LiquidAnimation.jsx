/**
 * 💧 LIQUID MORPHING BACKGROUND
 * 🛠️ Created by: Gemini 3 Flash (AI)
 * 🚀 Purpose: Organic, slow-drifting liquid blobs with a tech-grid overlay.
 */

import { motion } from "framer-motion";

const LiquidAnimation = () => {
  // 🧪 Droplets configured for large-scale movement
  const droplets = [
    { size: "w-64 h-64", color: "bg-indigo-600/20", duration: 35, delay: 0 },
    { size: "w-96 h-96", color: "bg-blue-600/20", duration: 45, delay: 1 },
    { size: "w-52 h-52", color: "bg-pink-500/15", duration: 30, delay: 5 },
    { size: "w-72 h-72", color: "bg-cyan-500/20", duration: 40, delay: i => i * 3 },
    { size: "w-40 h-40", color: "bg-purple-500/20", duration: 25, delay: 1 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#020617] z-0">
      {/* 🟦 TECH GRID */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* 🌌 AMBIENT DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)]" />

      {droplets.map((d, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[2px] ${d.size} ${d.color} border border-white/5`}
          // 🚀 START AT RANDOM POSITIONS
          initial={{ 
            x: Math.random() * 100 + "vw", 
            y: Math.random() * 100 + "vh" 
          }}
          animate={{
            // 🚀 SLOW DRIFT ACROSS ENTIRE AREA
            x: ["-10vw", "110vw", "50vw", "-10vw"],
            y: ["60vh", "-10vh", "110vh", "60vh"],
            scale: [1, 1.2, 0.8, 1],
            
            // 💧 LIQUID MORPHING
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 50% 60% 40% 60%",
              "40% 60% 70% 30% / 40% 50% 60% 50%"
            ]
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: "linear", // Linear makes the "Slowly Slowly" part feel consistent
          }}
        />
      ))}

      {/* 🌫️ FROSTED FINISH */}
      <div className="absolute inset-0 backdrop-blur-[2px] opacity-30" />
      
      {/* 🌑 VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#020617_85%)]" />
    </div>
  );
};

export default LiquidAnimation;