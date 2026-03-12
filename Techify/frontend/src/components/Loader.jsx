import React from 'react';

/**
 * 🛰️ CYBER_SCAN LOADER COMPONENT
 * Features: High-performance masking, dual-layer rotation, and ambient glow.
 */
function Loader() {
  return (
    // ⚓ POSITIONING: Fixed bottom-right with high z-index to stay above table content
    // 'pointer-events-none' prevents the loader from intercepting clicks on the UI
    <div className="fixed bottom-10 right-10 z-[1000] pointer-events-none flex items-center gap-4 animate-fade-in">
      
      {/* 🌌 LOADER CORE: Relative container for layered absolute elements */}
      <div className="relative flex items-center justify-center w-[3rem] h-[3rem]">
        
        {/* 🌈 CONIC GRADIENT RING: Primary energy trail effect */}
        <div 
          className="absolute inset-0 rounded-full animate-spin-fast opacity-100"
          style={{ 
            background: 'conic-gradient(from 0deg, #22d3ee 0%, #3b82f6 30%, #d946ef 70%, transparent 100%)',
            
            // 💎 TRANSPARENCY MASK: Creates a hollow center by hiding the inner 58% of the ring
            // Webkit prefixes ensure compatibility with Safari and Chrome browsers
            WebkitMaskImage: 'radial-gradient(transparent 58%, black 63%)',
            maskImage: 'radial-gradient(transparent 58%, black 63%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
          }}
        ></div>

        {/* 🛰️ SCANNER DOT: A bright white focal point spinning at a slower pace for visibility */}
        <div className="absolute inset-0 z-20 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_15px_#22d3ee]"></div>
        </div>

        {/* 💡 AMBIENT NEON GLOW: Soft blurred core that pulses to provide depth and lighting */}
        <div className="absolute inset-2 rounded-full blur-xl opacity-20 bg-cyan-500 animate-pulse"></div>
      </div>

      {/* 📝 CSS ANIMATION DEFINITIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* 🏎️ FAST ROTATION: Used for the gradient energy ring */
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* 🐌 SLOW ROTATION: Used for the scanner dot orbit */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 🎬 ENTRANCE ANIMATION: Smoothly slides the loader in from the right */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-spin-fast { 
          animation: spin-fast 0.7s linear infinite; 
        }

        .animate-spin-slow { 
          animation: spin-slow 2s linear infinite; 
        }

        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}

export default Loader;