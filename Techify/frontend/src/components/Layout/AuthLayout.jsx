import { Outlet } from "react-router-dom";
import LiquidAnimation from "../Animation/LiquidAnimation";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#020617] text-white px-4 overflow-hidden">
      {/* PERSISTENT BACKGROUND - Never unmounts during login/register swap */}
      <LiquidAnimation />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* PERSISTENT HEADER */}
        <div className="text-center mb-6 sm:mb-8 animate-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            TECHIFY
          </h1>
        </div>

        {/* DYNAMIC FORM AREA */}
        <Outlet /> 
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-up {
          animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;