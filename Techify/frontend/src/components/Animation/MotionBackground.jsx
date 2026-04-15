/**
 * 💧 LIQUID MORPHING BACKGROUND
 * 🛠️ Created by: Gemini 3 Flash (AI)
 * 🚀 Purpose: Organic, slow-drifting liquid blobs with a tech-grid overlay.
 */


import { motion } from "framer-motion";

const MotionBackground = () => {
  // 🔹 Very few particles (performance friendly)
  const nodes = Array.from({ length: 6 }).map(() => ({
    size: Math.random() * 1.5 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 25,
  }));

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-[#02020a] overflow-hidden">
      
      {/* 🟦 Base */}
      <div className="absolute inset-0 bg-[#02020a]" />

      {/* 🏁 Ultra Light Grid */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* 🌊 SINGLE VERY SOFT WAVE */}
      <motion.div
        className="absolute w-[200%] h-[120px] top-[40%]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          viewBox="0 0 1600 100"
          className="w-full h-full fill-none opacity-[0.03]"
        >
          <path
            d="M0 50 Q 400 20 800 50 T 1600 50"
            strokeWidth="1"
            className="stroke-slate-400"
          />
        </svg>
      </motion.div>

      {/* 💎 Minimal Particles */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-slate-300/10"
          style={{
            width: node.size,
            height: node.size,
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
          }}
        />
      ))}

      {/* 🌑 Soft Center Focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,#02020a_100%)]" />
    </div>
  );
};

export default MotionBackground;